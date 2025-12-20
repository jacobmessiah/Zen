import DOBInput from "@/components/ui/dob-input"
import { Button, Field, Flex, Heading, Input, Text, } from "@chakra-ui/react"
import { chakra } from "@chakra-ui/react"
import { Link } from "react-router-dom"

const SignUpContainer = () => {
    return (
        <Flex
            alignItems="center" direction="column"
            w="full" h="full"
            userSelect="none"
            py={{ base: "10px", lg: "30px", md: "20px" }} gap="4"  >


            <Heading textAlign="center" >Create an Account</Heading>


            <chakra.form w="95%" display="flex" flexDir="column" gap="5" >
                <Field.Root>
                    <Field.Label>Email</Field.Label>
                    <Input rounded="lg" pl="1" />
                </Field.Root>

                <Field.Root>
                    <Field.Label>Full Name</Field.Label>
                    <Input rounded="lg" pl="1" />
                </Field.Root>

                <Field.Root>
                    <Field.Label>Username</Field.Label>
                    <Input rounded="lg" pl="1" />
                </Field.Root>

                <Field.Root>
                    <Field.Label>Password</Field.Label>
                    <Input rounded="lg" pl="1" />
                </Field.Root>


                <Field.Root gap="10px">
                    <Field.Label>Date of birth</Field.Label>



                    <DOBInput />
                </Field.Root>


                <Button rounded="lg" type="submit" >
                    Create Account
                </Button>

            </chakra.form>


            <Text>Already have an Account?  <Link to={".."} >Login</Link>  </Text>

        </Flex>
    )
}

export default SignUpContainer
