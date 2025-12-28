import { Flex } from "@chakra-ui/react";
import ChatSideBar from "./components/chat-side-bar";

const ChatsContainer = () => {
  return (
    <Flex w="full" h="full" roundedTopLeft="15px">
      <ChatSideBar />
    </Flex>
  );
};

export default ChatsContainer;
