import { Flex } from "@chakra-ui/react";
import AppSideBar from "./components/ui/app-side-bar";

const AppTopRibbon = () => {
  return <div></div>;
};

const AppContainer = () => {
  return (
    <Flex className="bgColors" minH="100vh">
      <Flex py="15px" px="10px" w="5%" minH="full">
        <AppSideBar />
      </Flex>

      <Flex flex={1}>
        <AppTopRibbon />
      </Flex>
    </Flex>
  );
};

export default AppContainer;
