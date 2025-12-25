import { Flex } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";

const HomePageContainer = () => {
  return (
    <Flex alignItems="center" justifyContent="center">
      <Navigate to="/app/chats" replace />
    </Flex>
  );
};
export default HomePageContainer;
