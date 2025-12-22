import {
  Button,
  Field,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { IoEyeOffOutline } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { chakra } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import userAuthStore from "../../../store/user-auth-store";
import { useColorModeValue } from "../../../components/ui/color-mode";
import { BeatLoader } from "react-spinners";
import { handleLogin } from "../../../utils/authFunction";
import { useTranslation } from "react-i18next";

const LoginContainer = () => {
  const { isLoginIn, authUser } = userAuthStore();
  const navigate = useNavigate();
  const { t: translate, i18n } = useTranslation(["auth"]);
  const formErrorBase = "login.form.errorTexts";

  const [showPassword, setShowPassword] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    handle: "",
    password: "",
  });

  const [isFormError, setIsFormError] = useState({
    password: {
      value: false,
      errorText: "",
    },
    handle: {
      value: false,
      errorText: "",
    },
  });

  const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const usernameRegEx = /^[a-zA-Z0-9_]{3,20}$/;

  const handleSummitFunction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoginIn) return;

    if (authUser) {
      navigate("/zen");
    }

    let isError = false;
    const identifier = loginDetails.handle.trim();
    const cleanPassword = loginDetails.password.trim();

    if (!identifier) {
      isError = true;
      setIsFormError((prev) => ({
        ...prev,
        handle: {
          value: true,
          errorText: translate(`${formErrorBase}.HANDLE_REQUIRED`),
        },
      }));
    } else {
      const isEmailAttempt = identifier.includes("@");

      if (isEmailAttempt) {
        const [localPart] = identifier.split("@");

        if (localPart.length < 3 || !emailRegEx.test(identifier)) {
          isError = true;
          setIsFormError((prev) => ({
            ...prev,
            handle: {
              value: true,
              errorText: translate(`${formErrorBase}.VALID_EMAIL_REQUIRED`),
            },
          }));
        }
      } else {
        if (identifier.length < 4 || !usernameRegEx.test(identifier)) {
          isError = true;
          setIsFormError((prev) => ({
            ...prev,
            handle: {
              value: true,
              errorText: translate(`${formErrorBase}.USERNAME_NOT_COMPLETE`),
            },
          }));
        }
      }
    }

    if (!cleanPassword) {
      isError = true;
      setIsFormError((prev) => ({
        ...prev,
        password: {
          value: true,
          errorText: translate(`${formErrorBase}.PASSWORD_REQUIRED`),
        },
      }));
    } else if (cleanPassword.length < 6) {
      isError = true;
      setIsFormError((prev) => ({
        ...prev,
        password: {
          value: true,
          errorText: translate(`${formErrorBase}.PASSWORD_NOT_COMPLETE`),
        },
      }));
    }

    if (isError) return;

    const authFuncRes = await handleLogin(loginDetails);

    if (authFuncRes.isError) {
      setIsFormError((prev) => ({
        ...prev,
        handle: {
          errorText: authFuncRes.errorMessage,
          value: authFuncRes.isError,
        },
        password: {
          errorText: authFuncRes.errorMessage,
          value: authFuncRes.isError,
        },
      }));
    } else {
      userAuthStore.setState({ authUser: authFuncRes.authUser });
      navigate("/");
    }
  };

  const emailMaxLength = 54;
  const passwordMaxLength = 54;

  const handleOnChangeHandle = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value.length > emailMaxLength) return;

    setLoginDetails((prev) => ({ ...prev, handle: value }));

    if (isFormError.handle.value) {
      setIsFormError((prev) => ({
        ...prev,
        handle: { value: false, errorText: "" },
      }));
    }
  };

  const handleOnchangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value.length > passwordMaxLength) return;

    setLoginDetails((prev) => ({ ...prev, password: value }));

    if (isFormError.password.value) {
      setIsFormError((prev) => ({
        ...prev,
        password: { value: false, errorText: "" },
      }));
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const headText = translate("login.form.welcomeText.header");
  const followUpText = translate("login.form.welcomeText.followUpText");
  const passwordFieldText = translate("login.form.formText.password");
  const handleFieldText = translate("login.form.formText.handle");
  const LoginButtonText = translate("login.form.buttonText");
  const needAccountQuestion = translate("login.form.needAccountText.question");
  const needAccountInstruction = translate(
    "login.form.needAccountText.instruction"
  );

  return (
    <Flex
      alignItems="center"
      direction="column"
      w="full"
      h="full"
      userSelect="none"
      py={{ base: "10px", lg: "30px", md: "20px" }}
    >
      <Flex
        alignItems="center"
        w={{ base: "95%", lg: "90%" }}
        direction="column"
        gap="3.5"
      >
        <Flex mb="15px" direction="column" gap="2" w="full" alignItems="center">
          <Heading fontSize="2xl" mt="10px">
            {headText}
          </Heading>
          <Text>{followUpText}</Text>
        </Flex>

        <chakra.form
          onSubmit={handleSummitFunction}
          w="full"
          display="flex"
          flexDir="column"
          gap="3"
        >
          <Field.Root invalid={isFormError.handle.value}>
            <Field.Label>{handleFieldText}</Field.Label>
            <Input
              size="md"
              onChange={handleOnChangeHandle}
              maxLength={emailMaxLength}
              rounded="lg"
              pl="1.5"
            />
            <Field.ErrorText>{isFormError.handle.errorText}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={isFormError.password.value}>
            <Field.Label>{passwordFieldText}</Field.Label>
            <InputGroup
              endElement={
                <IconButton
                  onClick={toggleShowPassword}
                  mr="5px"
                  size="xs"
                  variant="ghost"
                  rounded="full"
                >
                  {showPassword ? (
                    <IoEyeOffOutline />
                  ) : (
                    <MdOutlineRemoveRedEye />
                  )}
                </IconButton>
              }
            >
              <Input
                autoComplete="password"
                size="md"
                type={showPassword ? "text" : "password"}
                onChange={handleOnchangePassword}
                maxLength={passwordMaxLength}
                w="full"
                rounded="lg"
                pl="1.5"
              />
            </InputGroup>
            <Field.ErrorText>{isFormError.password.errorText}</Field.ErrorText>
          </Field.Root>

          <Button rounded="lg" type="submit">
            {isLoginIn ? (
              <BeatLoader
                color={useColorModeValue("white", "black")}
                size={8}
                loading
              />
            ) : (
              LoginButtonText
            )}
          </Button>
        </chakra.form>

        <Text>
          {needAccountQuestion}{" "}
          <Link to={"signup"}>{needAccountInstruction}</Link>{" "}
        </Text>
      </Flex>
    </Flex>
  );
};

export default LoginContainer;
