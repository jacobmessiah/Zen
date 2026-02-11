import userAuthStore from "@/store/user-auth-store";
import userChatStore from "@/store/user-chat-store";
import type { IMessage } from "@/types/schema";
import { Avatar, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { BsImageFill, BsRobot } from "react-icons/bs";

const P2PMessageReplyUI = ({
  replyToMessage,
}: {
  replyToMessage?: IMessage;
}) => {
  const selectedConversation = userChatStore(
    (state) => state.selectedConversation,
  );

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  const authUser = userAuthStore((state) => state.authUser);

  const otherUser =
    replyToMessage &&
    authUser &&
    selectedConversation &&
    (replyToMessage.senderId === authUser._id
      ? authUser
      : selectedConversation.otherUser);

  const { t: translate } = useTranslation(["chat"]);

  const { messageDeletedText } = translate("MessageReplyUI") as unknown as {
    messageDeletedText: string;
  };

  const getReplyRendition = (scrollToReplied: () => void) => {
    if (
      !replyToMessage ||
      typeof replyToMessage === "undefined" ||
      typeof replyToMessage === "string"
    ) {
      return (
        <Text
          fontSize="sm"
          cursor="pointer"
          color="fg.muted"
          fontStyle="italic"
        >
          {messageDeletedText}
        </Text>
      );
    }

    if (replyToMessage && replyToMessage.type === "default") {
      return (
        <Flex onClick={scrollToReplied} alignItems="center" gap="5px" w="full">
          {replyToMessage.text && replyToMessage.text.length > 0 && (
            <Text fontSize="sm" whiteSpace="nowrap" overflow="hidden">
              {replyToMessage.text.slice(0, isMobile ? 30 : 80).trim()}...
            </Text>
          )}{" "}
          {replyToMessage.attachments &&
            replyToMessage.attachments.length > 0 && <BsImageFill />}
        </Flex>
      );
    }
  };

  const hasReplyTo = !!replyToMessage;

  const scrollToReplied = () => {
    if (!hasReplyTo || !replyToMessage?._id) return;

    const el = document.getElementById(replyToMessage._id);

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.remove("message-blink");
      el.classList.add("message-blink");
    }
  };
  return (
    <Flex userSelect="none" gap="5px" alignItems="center" pl="5px" w="full">
      {otherUser && (
        <Flex gap="5px" alignItems="center">
          <Avatar.Root boxSize="20px">
            <Avatar.Fallback>
              <BsRobot style={{ width: "10px", height: "10px" }} />
            </Avatar.Fallback>
          </Avatar.Root>

          <Text
            color="fg.muted"
            _hover={{
              textDecor: "underline",
            }}
          >
            {otherUser.displayName}
          </Text>
        </Flex>
      )}
      {getReplyRendition(scrollToReplied)}
    </Flex>
  );
};

export { P2PMessageReplyUI };
