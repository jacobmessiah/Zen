import { Flex, Heading, Image } from "@chakra-ui/react";
import { useColorMode } from "../../../components/ui/color-mode";

export const LogoImage = () => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      w="full"
      h="70px"
      justifyContent="center"
      alignItems="center"
      display={{ base: "flex", md: "flex", lg: "none" }}
      gap="10px"
    >
      <Image
        w="35px"
        src={colorMode === "light" ? "/black.svg" : "/white.svg"}
      />
      <Heading fontSize="2xl">Zen</Heading>
    </Flex>
  );
};

const AuthRibbonBar = () => {
  const { colorMode } = useColorMode();
  return (
    <Flex
      display={{ base: "none", lg: "flex" }}
      minH={{ base: "150px", lg: "auto" }}
      w="full"
      p="20px"
      justifyContent={{ base: "center", lg: "flex-start" }}
      alignItems="center"
      gap="5px"
      left="0"
      pos={{ lg: "absolute" }}
      top="0"
    >
      <Image
        w={{ base: "75px", lg: "40px" }}
        src={colorMode === "light" ? "/black.svg" : "/white.svg"}
      />
      <Heading display={{ base: "none", lg: "inline" }} fontSize="2xl">
        Zen
      </Heading>
    </Flex>
  );
};

export default AuthRibbonBar;
