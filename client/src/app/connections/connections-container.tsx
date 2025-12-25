import { Flex } from "@chakra-ui/react";
import ConnectionSideBar from "./components/connection-side-bar";

const ConnectionsContainer = () => {
  return (
    <Flex roundedTopLeft={{ base: "none", lg: "15px" }} minW="full" h="full">
      <ConnectionSideBar />
    </Flex>
  );
};
export default ConnectionsContainer;
