import { Flex } from "@chakra-ui/react";
import userChatStore from "@/store/user-chat-store";
import ChatSideBar from "./components/chat-side-bar";
import MessageContainer, {
  NoConversationSelectedUI,
} from "./message/message-container";

const ChatsContainer = () => {
  const { selectedConversation } = userChatStore();

  return (
    <Flex w="full" h="full" roundedTopLeft="15px">
      <ChatSideBar />

      <Flex
        pos={{ base: "fixed", md: "relative", lg: "relative" }}
        right={{
          base: selectedConversation ? "0%" : "-100%",
          md: "auto",
          lg: "auto",
        }}
        transition="0.3s ease"
        zIndex={{ base: 20, md: "auto", lg: "auto" }}
        h={{ base: "100dvh", md: "auto", lg: "auto" }}
        w={{ base: "100vw", md: "55%", lg: "70%" }}
        bg={{
          // base: { _light: "white", _dark: "gray.950" },
          base: "bg",
          md: "inherit",
          lg: "inherit",
        }}
      >
        {selectedConversation ? (
          <MessageContainer selectedConversation={selectedConversation} />
        ) : (
          <NoConversationSelectedUI />
        )}
      </Flex>
    </Flex>
  );
};

export default ChatsContainer;
