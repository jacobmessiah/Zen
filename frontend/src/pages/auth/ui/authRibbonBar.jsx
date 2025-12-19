import { useColorMode } from "@/components/ui/color-mode"
import { Flex, Heading, Image } from "@chakra-ui/react"


const AuthRibbonBar = () => {
    const { colorMode } = useColorMode()
    return (
        <Flex  minH={{ base: "150px", lg: "auto" }} w="full" p="20px" justifyContent={{ base: "center", lg: "flex-start" }} alignItems="center" gap="5px" left="0" pos={{ lg: "absolute" }} top="0" >
            <Image w={{ base: "75px", lg: "40px" }} src={colorMode === "light" ? "/black.svg" : "/white.svg"} />
            <Heading display={{ base: "none", lg: "inline" }} fontSize="2xl" >Zen</Heading>
        </Flex>
    )
}

export default AuthRibbonBar
