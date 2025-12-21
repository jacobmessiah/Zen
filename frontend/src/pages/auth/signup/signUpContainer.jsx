import DOBInput from "@/components/ui/dob-input"
import authUserStore from "@/store/authUserStore"
import { handleSignup } from "@/utils/authFunction"
import { Button, Field, Flex, Heading, Input, Text, } from "@chakra-ui/react"
import { chakra } from "@chakra-ui/react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { BeatLoader } from 'react-spinners'
import { useColorModeValue } from "@/components/ui/color-mode"

const SignUpContainer = () => {

    const { isSigningUp } = authUserStore()


    const navigate = useNavigate()

    const [signupDetails, setSignupDetails] = useState({
        displayName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        dob: null,
    })

    const [isFormError, setIsFormError] = useState({
        displayName: { value: false, errorText: "" },
        lastName: { value: false, errorText: "" },
        email: { value: false, errorText: "" },
        username: { value: false, errorText: "" },
        password: { value: false, errorText: "" },
        dob: { value: false, errorText: "" }
    })

    const validateForm = () => {
        let errors = {
            displayName: { value: false, errorText: "" },
            email: { value: false, errorText: "" },
            username: { value: false, errorText: "" },
            password: { value: false, errorText: "" },
            dob: { value: false, errorText: "" },
        };

        let isValid = true;

        const displayName = signupDetails.displayName;
        const email = signupDetails.email;       // already lowercased
        const username = signupDetails.username; // already lowercased
        const password = signupDetails.password;
        const dob = signupDetails.dob;

        /* ---------- Display Name ---------- */
        if (!displayName || !displayName.trim()) {
            errors.displayName = {
                value: true,
                errorText: "Display name is required",
            };
            isValid = false;
        } else {
            const nameLength = displayName.trim().length;

            if (nameLength < 4) {
                errors.displayName = {
                    value: true,
                    errorText: "Display name must be at least 4 characters",
                };
                isValid = false;
            } else if (nameLength > 30) {
                errors.displayName = {
                    value: true,
                    errorText: "Display name cannot exceed 30 characters",
                };
                isValid = false;
            }
        }

        /* ---------- Email ---------- */
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

        if (!email || email.includes(" ")) {
            errors.email = {
                value: true,
                errorText: "Email cannot contain spaces",
            };
            isValid = false;
        } else if (email.length < 9 || email.length > 60) {
            errors.email = {
                value: true,
                errorText: "Email must be between 9 and 60 characters",
            };
            isValid = false;
        } else if (!emailRegex.test(email)) {
            errors.email = {
                value: true,
                errorText: "Enter a valid email address",
            };
            isValid = false;
        }

        /* ---------- Username ---------- */
        const usernameRegex = /^[a-z0-9_]{4,20}$/;

        if (!username) {
            errors.username = {
                value: true,
                errorText: "Username is required",
            };
            isValid = false;
        } else if (!usernameRegex.test(username)) {
            errors.username = {
                value: true,
                errorText:
                    "Username must be 4–20 characters (letters, numbers, underscores)",
            };
            isValid = false;
        }

        /* ---------- Password ---------- */
        if (!password || password.length < 6 || password.length > 50) {
            errors.password = {
                value: true,
                errorText: "Password must be between 6 and 50 characters",
            };
            isValid = false;
        }

        /* ---------- Date of Birth ---------- */
        if (!(dob instanceof Date) || isNaN(dob.getTime())) {
            errors.dob = {
                value: true,
                errorText: "Invalid date of birth",
            };
            isValid = false;
        } else {
            const today = new Date();

            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            const dayDiff = today.getDate() - dob.getDate();

            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                age--;
            }

            if (age < 7) {
                errors.dob = {
                    value: true,
                    errorText: "Minimum age is 7 years",
                };
                isValid = false;
            }
        }

        setIsFormError(errors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let formattedValue = value;

        // ---------- Normalize & restrict ----------
        if (name === "email") {
            formattedValue = value
                .toLowerCase()
                .replace(/\s/g, "")
                .slice(0, 60);
        }

        if (name === "username") {
            formattedValue = value
                .toLowerCase()
                .replace(/\s/g, "")
                .slice(0, 20);
        }

        if (name === "displayName") {
            formattedValue = value.slice(0, 30);
        }

        if (name === "password") {
            formattedValue = value.slice(0, 50);
        }

        setSignupDetails((prev) => ({
            ...prev,
            [name]: formattedValue,
        }));

        // ---------- Clear error for this field ----------
        setIsFormError((prev) => ({
            ...prev,
            [name]: { value: false, errorText: "" },
        }));
    };

    const isValidAge = (dob, minAge = 7) => {
        if (!(dob instanceof Date) || isNaN(dob.getTime())) return false;

        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();

        const monthDiff = today.getMonth() - dob.getMonth();
        const dayDiff = today.getDate() - dob.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        return age >= minAge;
    };


    const handleDobChange = (date) => {
        setSignupDetails((prev) => ({
            ...prev,
            dob: date,
        }));


        // Only clear error if DOB is actually valid
        if (isValidAge(date)) {
            setIsFormError((prev) => ({
                ...prev,
                dob: { value: false, errorText: "" },
            }));
        }
    };



    const handleSubmit = async (event) => {
        event.preventDefault();

        const readyToSubmit = validateForm();
        if (!readyToSubmit) return;

        const signupRes = await handleSignup(signupDetails);

        // Global / server error (not tied to an input)
        if (signupRes.isError && !signupRes.errorOnInput && signupRes.errorText) {
            toast.error(signupRes.errorText);
            return;
        }

        // Field-specific error
        if (signupRes.isError && typeof signupRes.errorOnInput === "string" && signupRes.errorText) {
            setIsFormError((prev) => ({
                ...prev,
                [signupRes.errorOnInput]: {
                    value: true,
                    errorText: signupRes.errorText,
                },
            }));
            return;
        }

        // Success
        if (signupRes.authUser) {
            authUserStore.setState({
                authUser: signupRes.authUser
            });
            navigate("/");
        }
    };


    return (
        <Flex
            alignItems="center" direction="column"
            w="full" h="full"
            userSelect="none"
            py={{ base: "10px", lg: "30px", md: "20px" }} gap="4"  >



            <Heading textAlign="center" >Create an Account</Heading>


            <chakra.form
                onSubmit={handleSubmit}
                w="95%"
                display="flex"
                flexDir="column"
                gap="5"
            >
                {/* Display Name */}
                <Flex w="full" gap="2" alignItems="start" >
                    <Field.Root invalid={isFormError.displayName.value}>
                        <Field.Label>Display Name</Field.Label>
                        <Input
                            variant="outline"
                            name="displayName"
                            value={signupDetails.displayName}
                            onChange={handleChange}
                            rounded="lg"
                            pl="1"
                        />
                        <Field.ErrorText>{isFormError.displayName.errorText}</Field.ErrorText>
                    </Field.Root>

                </Flex>

                {/* Email */}
                <Field.Root invalid={isFormError.email.value}>
                    <Field.Label>Email</Field.Label>
                    <Input
                        name="email"
                        type="email"
                        onKeyDown={(e) => {
                            if (e.key === " ") {
                                e.preventDefault()
                            }
                        }}
                        value={signupDetails.email}
                        onChange={handleChange}
                        rounded="lg"
                        pl="1"
                    />
                    <Field.ErrorText>{isFormError.email.errorText}</Field.ErrorText>
                </Field.Root>

                {/* Username */}
                <Field.Root invalid={isFormError.username.value}>
                    <Field.Label>Username</Field.Label>
                    <Input
                        onKeyDown={(e) => {
                            if (e.key === " ") {
                                e.preventDefault()
                            }
                        }}
                        name="username"
                        value={signupDetails.username}
                        onChange={handleChange}
                        rounded="lg"
                        pl="1"
                    />
                    <Field.ErrorText>{isFormError.username.errorText}</Field.ErrorText>
                </Field.Root>

                {/* Password */}
                <Field.Root invalid={isFormError.password.value}>
                    <Field.Label>Password</Field.Label>
                    <Input
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        value={signupDetails.password}
                        onChange={handleChange}
                        rounded="lg"
                        pl="1"
                    />
                    <Field.ErrorText>{isFormError.password.errorText}</Field.ErrorText>
                </Field.Root>

                {/* DOB */}
                <Field.Root invalid={isFormError.dob.value} gap="10px">
                    <Field.Label>Date of birth</Field.Label>
                    <DOBInput
                        onChange={handleDobChange}
                    />
                    <Field.ErrorText>{isFormError.dob.errorText}</Field.ErrorText>
                </Field.Root>

                <Button rounded="lg" type="submit">
                    {isSigningUp ?
                        <BeatLoader color={useColorModeValue("white", "black")} size={8} loading /> : "Create Account"}
                </Button>
            </chakra.form>



            <Text>Already have an Account?  <Link to={".."} >Login</Link>  </Text>

        </Flex>
    )
}

export default SignUpContainer
