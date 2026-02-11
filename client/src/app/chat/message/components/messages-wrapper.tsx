import { Flex } from "@chakra-ui/react";
import MessageStartUI from "./message-start-ui";
import { useTranslation } from "react-i18next";
import MessageSeparator from "./message-separator";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import userChatStore from "@/store/user-chat-store";
import userAuthStore from "@/store/user-auth-store";
import type { MessageActionTranslations } from "@/types";
import MessageItemContainer from "@/app/shared/message/message-map/message-item-container";
import type { Attachment } from "@/types/schema";

const MessagesWrapper = () => {
  const selectedConversation = userChatStore(
    (state) => state.selectedConversation,
  );
  const displayedMessages = userChatStore((state) => state.displayedMessages);
  const authUser = userAuthStore((state) => state.authUser);

  const { t: translate } = useTranslation(["chat"]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const beginningOfChatText = translate("beginningOfChatText");
  const messageActions = translate(
    "messageActions",
  ) as unknown as MessageActionTranslations;

  const forwardText = translate("forwardText");

  const getUploadingFilesText = (attachments: Attachment[]): string => {
    if (attachments.length === 1) {
      return attachments[0].name;
    } else {
      translate("UploadingFiles", { number: attachments.length });
    }

    return "";
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [displayedMessages]);

  return (
    <Flex
      flex={1}
      pt="1.5"
      pr={{ base: "0px", lg: "8px" }}
      overflowY="auto"
      direction="column"
      // Add smooth scrolling
      css={{
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "fg.muted",
          borderRadius: "full",
        },
      }}
      w="full"
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
        const showSeparator = i === 0 || currentDay !== prevDay;

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
            {showSeparator && (
              <MessageSeparator createdAt={message.createdAt} />
            )}

            <MessageItemContainer
              forwardText={forwardText}
              isMine={isMine}
              senderProfile={senderProfile}
              message={message}
              messageActions={messageActions}
              getUploadingFilesText={getUploadingFilesText}
              showSimpleStyle={showSimpleStyle}
            />
          </Fragment>
        );
      })}

      <Flex ref={scrollRef} minH="5px" p="1px" w="full" />
    </Flex>
  );
};

export default MessagesWrapper;
