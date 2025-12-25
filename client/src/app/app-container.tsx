import { Flex, Image } from "@chakra-ui/react";
import { useColorModeValue } from "../components/ui/color-mode";
import { Outlet } from "react-router-dom";
import AppNavigatorBig from "./components/ui/app-navigator";

const AppTopRibbon = () => {
  const source = useColorModeValue("/black.svg", "/white.svg");

  //Add Electron close minimize maximize buttons here later

  return (
    <Flex alignItems="center" w="full" h="full">
      <Flex
        pointerEvents="none"
        userSelect="none"
        ml="5"
        alignItems="center"
        gap="5px"
      >
        <Image width="30px" height="30px" src={source} objectFit="contain" />
      </Flex>
    </Flex>
  );
};

const AppContainer = () => {
  const shelfColor = useColorModeValue("#fbfbfcff", "gray.900");

  const contentBg = useColorModeValue("white", "gray.950");

  return (
    <Flex bg={shelfColor} direction="column" minH="100vh" h="100vh">
      <Flex w="full" h="6%">
        <AppTopRibbon />
      </Flex>
      <Flex w="full" h="calc(100% - 5%)">
        <Flex pt="10px" minH="full" w="5%">
          <AppNavigatorBig />
        </Flex>

        <Flex
          border="1px solid"
          borderColor="colorPalette.muted"
          flex={1}
          bg={contentBg}
          roundedTopLeft="20px"
        >
          <Outlet />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AppContainer;
