import { AbsoluteCenter, Flex, Heading, Text } from "@chakra-ui/react";
import AuthLogo from "../../../components/ui/logo-export";
import type { IConversation } from "../../../types/schema";
import { MessageInputUI } from "../../shared/message-input-ui";
import MessageTopRibbon from "./top-message-ribbon";
import { useTranslation } from "react-i18next";

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

  return (
    <Flex direction="column" maxW="full" minW="full" minH="full" maxH="full">
      <MessageTopRibbon otherUser={selectedConversation?.otherUser} />
      <Flex flex={1} p="1" />
      <MessageInputUI inputPlaceHolder={messageInputPlaceholder} />
    </Flex>
  );
};

export default MessageContainer;
