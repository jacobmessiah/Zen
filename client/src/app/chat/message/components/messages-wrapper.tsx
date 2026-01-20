import { Flex } from "@chakra-ui/react";
import userChatStore from "../../../../store/user-chat-store";
import MessageStartUI from "./message-start-ui";
import { useTranslation } from "react-i18next";
import userAuthStore from "../../../../store/user-auth-store";
import MessageSeparator from "./message-separator";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import MessageItemContainer from "../../../shared/message/message-map/message-item-container";
import type { MessageActionTranslations } from "../../../../types";

const MessagesWrapper = () => {
  const selectedConversation = userChatStore(
    (state) => state.selectedConversation,
  );
  const displayedMessages = userChatStore((state) => state.displayedMessages);
  const authUser = userAuthStore((state) => state.authUser);

  const { t: translate } = useTranslation(["chat"]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const beginningOfChatText = translate("beginningOfChatText");
  const messageActions: MessageActionTranslations = {
    addReaction: translate("messageActions.addReaction"),
    editMessage: translate("messageActions.editMessage"),
    replyMessage: translate("messageActions.replyMessage"),
    forwardMessage: translate("messageActions.forwardMessage"),
    speakText: translate("messageActions.speakMessage"),
    copyText: translate("messageActions.copyText"),
    deleteMessage: translate("messageActions.deleteMessage"),
    moreText: translate("messageActions.moreText"),
  };
  const getUploadingFilesText = (count: number) =>
    translate("UploadingFiles", { number: count });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [displayedMessages]);

  return (
    <Flex
      flex={1}
      p="1.5"
      overflowY="auto"
      direction="column"
      // Add smooth scrolling
      css={{
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "bg.muted",
          borderRadius: "full",
        },
      }}
    >
      <MessageStartUI
        beginningOfChatText={beginningOfChatText}
        otherUser={selectedConversation?.otherUser}
      />

      {/* Provide translated message action labels once to avoid repeated lookups. */}
      {displayedMessages.slice().map((message, i) => {
        const currentDay = new Date(message.createdAt).setHours(0, 0, 0, 0);
        const prevDay =
          i > 0
            ? new Date(displayedMessages[i - 1].createdAt).setHours(0, 0, 0, 0)
            : null;
        const showSeperator = i === 0 || currentDay !== prevDay;

        const prevMessage = i > 0 ? displayedMessages[i - 1] : null;

        const showSimpleStyle = prevMessage
          ? new Date(prevMessage.createdAt).getMinutes() ===
              new Date(message.createdAt).getMinutes() &&
            prevMessage.senderId === message.senderId
          : false;

        const isMine = message.senderId === authUser?._id;

        const senderProfile = isMine
          ? authUser
          : selectedConversation?.otherUser;

        return (
          <Fragment key={message._id}>
            {showSeperator && (
              <MessageSeparator createdAt={message.createdAt} />
            )}

            <MessageItemContainer
              isMine
              senderProfile={senderProfile}
              message={message}
              messageActions={messageActions}
              getUploadingFilesText={getUploadingFilesText}
              showSimpleStyle={showSimpleStyle}
            />
          </Fragment>
        );
      })}

      <Flex ref={scrollRef} minH="20px" p="1px" w="full" />
    </Flex>
  );
};

export default MessagesWrapper;
