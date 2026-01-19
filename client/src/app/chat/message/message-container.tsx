import { AbsoluteCenter, Flex, Heading, Text } from "@chakra-ui/react";
import AuthLogo from "../../../components/ui/logo-export";
import type { IConversation } from "../../../types/schema";
import MessageTopRibbon from "./components/top-message-ribbon";
import { useTranslation } from "react-i18next";
import MessagesWrapper from "./components/messages-wrapper";
import MessageInputUI from "../../shared/message/message-input-ui";
import { useEffect } from "react";
import { getMessages } from "../../../utils/chatFunctions";

export const NoConversationSelectedUI = () => {
  return (
    <AbsoluteCenter
      pos="relative"
      maxW="full"
      minW="full"
      minH="full"
      maxH="full"
      userSelect="none"
      flexDir="column"
    >
      <AuthLogo />
      <Heading mt={10} size="lg" mb={2}>
        Conversations start here
      </Heading>
      <Text
        w={{ lg: "auto", md: "auto", base: "90%" }}
        textAlign="center"
        color="fg.muted"
        fontSize="md"
      >
        Choose a chat, speak your mind, and let the flow take over!
      </Text>
    </AbsoluteCenter>
  );
};

const MessageContainer = ({
  selectedConversation,
}: {
  selectedConversation: IConversation;
}) => {
  const { t: translate } = useTranslation(["chat"]);
  const messageInputPlaceholder = translate("messageInputPlaceholder", {
    username: selectedConversation.otherUser.username,
  });

  useEffect(() => {
    if (selectedConversation && !selectedConversation.isTemp) {
      getMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  return (
    <Flex direction="column" maxW="full" minW="full" minH="full" maxH="full">
      <MessageTopRibbon otherUser={selectedConversation?.otherUser} />
      <MessagesWrapper />
      <MessageInputUI inputPlaceHolder={messageInputPlaceholder} />
    </Flex>
  );
};

export default MessageContainer;
