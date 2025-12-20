import { Button, Field, Flex, Heading, IconButton, Input, InputGroup, Separator, Text } from "@chakra-ui/react"
import { useState } from "react"
import { IoEyeOffOutline } from "react-icons/io5"
import { MdOutlineRemoveRedEye } from "react-icons/md"
import { chakra } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import { handleLogin } from "@/utils/authFunction"
import authUserStore from "@/store/authUserStore"


const LoginContainer = () => {


  const { isLoginIn, authUser } = authUserStore()
  const navigate = useNavigate()


  const [showPassword, setShowPassword] = useState(false)
  const [loginDetails, setLoginDetails] = useState({
    handle: "",
    password: "",
  })


  const [isFormError, setIsFormError] = useState({
    password: {
      value: false,
      errorText: ""
    },
    handle: {
      value: false,
      errorText: ""
    }
  })


  const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const usernameRegEx = /^[a-zA-Z0-9_]{3,20}$/;




  const handleSummitFunction = async (event) => {

    if (isLoginIn) return

    if (authUser) {
      navigate("/zen")
    }

    event.preventDefault();
    let isError = false;
    const identifier = loginDetails.handle.trim();
    const cleanPassword = loginDetails.password.trim();

    if (!identifier) {
      isError = true;
      setIsFormError(prev => ({
        ...prev,
        email: { value: true, errorText: "Email or Username is required." }
      }));
    } else {
      const isEmailAttempt = identifier.includes("@");

      if (isEmailAttempt) {
        if (!emailRegEx.test(identifier)) {
          isError = true;
          setIsFormError(prev => ({
            ...prev,
            email: { value: true, errorText: "Please enter a valid email address." }
          }));
        }
      } else {
        if (!usernameRegEx.test(identifier)) {
          isError = true;
          setIsFormError(prev => ({
            ...prev,
            email: { value: true, errorText: "Usernames must be 3-20 characters (letters, numbers, underscores)." }
          }));
        }
      }
    }

    if (!cleanPassword) {
      isError = true;
      setIsFormError(prev => ({
        ...prev,
        password: { value: true, errorText: "Password cannot be empty." }
      }));
    } else if (cleanPassword.length < 6) {
      isError = true;
      setIsFormError(prev => ({
        ...prev,
        password: { value: true, errorText: "Password must be at least 6 characters." }
      }));
    }


    if (isError) return;


    const authFuncRes = await handleLogin(loginDetails)

    if (authFuncRes.isError) {
      setIsFormError((prev) => ({
        ...prev, handle: {
          errorText: authFuncRes.errorMessage, value: authFuncRes.isError
        },
        password: {
          errorText: authFuncRes.errorMessage, value: authFuncRes.isError
        }
      }))
    } else {
      authUserStore.setState({ authUser: authFuncRes.authUser })
      navigate("/")
    }

  }

  const emailMaxLength = 54
  const passwordMaxLength = 54

  const handleOnChangeHandle = (event) => {
    const value = event.target.value;

    if (value.length > emailMaxLength) return;

    setLoginDetails(prev => ({ ...prev, handle: value }));

    if (isFormError.handle.value) {
      setIsFormError(prev => ({
        ...prev,
        handle: { value: false, errorText: "" }
      }));
    }
  };

  const handleOnchangePassword = (event) => {
    const value = event.target.value;

    if (value.length > passwordMaxLength) return;

    setLoginDetails(prev => ({ ...prev, password: value }));

    if (isFormError.password.value) {
      setIsFormError(prev => ({
        ...prev,
        password: { value: false, errorText: "" }
      }));
    }
  };


  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }


  return (
    <Flex alignItems="center"
      direction="column" w="full" h="full"

      userSelect="none" py={{ base: "10px", lg: "30px", md: "20px" }}  >

      <Flex alignItems="center" w={{ base: "95%", lg: "90%" }} direction="column" gap="3.5" >
        <Flex mb="15px" direction="column" gap="2" w="full" alignItems="center" >
          <Heading fontSize="2xl" mt="10px" >Welcome back!</Heading>
          <Text>We're so excited to see you again!</Text>
        </Flex>



        <chakra.form onSubmit={handleSummitFunction} w="full" display="flex" flexDir="column" gap="3" >
          <Field.Root invalid={isFormError.handle.value} >
            <Field.Label>Email or Username</Field.Label>
            <Input size="md" onChange={handleOnChangeHandle} maxLength={emailMaxLength} rounded="lg" pl="1.5" />
            <Field.ErrorText>{isFormError.handle.errorText}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={isFormError.password.value} >
            <Field.Label>Password</Field.Label>
            <InputGroup endElement={<IconButton onClick={toggleShowPassword} mr="5px" size="xs" variant="ghost" rounded="full" >
              {showPassword ? <IoEyeOffOutline /> : <MdOutlineRemoveRedEye />}
            </IconButton>}  >
              <Input autoComplete="password" size="md" type={showPassword ? "text" : "password"} onChange={handleOnchangePassword} maxLength={passwordMaxLength} w="full" rounded="lg" pl="1.5" />
            </InputGroup>
            <Field.ErrorText>{isFormError.password.errorText}</Field.ErrorText>
          </Field.Root>

          <Button size="md" type="submit" w="full" rounded="lg"  >
            Login
          </Button>
        </chakra.form>

        <Text>Need an Account?  <Link to={"signup"} >Signup</Link> </Text>



      </Flex>
    </Flex>
  )
}

export default LoginContainer
