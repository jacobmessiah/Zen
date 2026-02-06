import { createDialog } from "@/app/dialog/create-dialog";
import type { MessageActionTranslations } from "@/types";
import type { Attachment, IMessage, IUser } from "@/types/schema";
import {
  formatDateSimpleStyle,
  formatMessageTimestamp,
  getEmojiUrl,
  initiateReplyTo,
} from "@/utils/chatFunctions";
import {
  Avatar,
  Flex,
  Float,
  Image,
  Menu,
  Portal,
  Separator,
  Text,
  type MenuSelectionDetails,
} from "@chakra-ui/react";
import { lazy, Suspense, useState } from "react";
import { BiSolidPencil } from "react-icons/bi";
import { BsRobot, BsThreeDots } from "react-icons/bs";
import { FaSmile } from "react-icons/fa";
import { HiReply, HiSpeakerphone } from "react-icons/hi";
import { IoCopy } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { P2PMessageReplyUI } from "./message-reply-ui";
import ShowFullTimeStampTooltip from "../show-full-createdAt-tooltip";
import MessageTextRenderer from "./message-text-renderer";
import UploadingFilesUI from "../uploading-files-ui";
import MessageAttachmentRenderer from "./message-attachment-render";
import MessageItemEmojiReact from "../../emoji-and-reactions/message-item-emoji-react";

const scrollCSS = {
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
};

const AttachmentFullScreenUI = lazy(
  () =>
    import("@/app/dialog/ui/attachment-preview/attachment-fullscreen-renderer"),
);

const MessageActionMenuItems = ({
  messageActions,
  isMine,
  hasText,
}: {
  messageActions: MessageActionTranslations;
  isMine: boolean;
  hasText: boolean;
}) => {
  const quickReactArray = [
    { text: "👍", value: "👍" },
    { text: "❤️", value: "❤️" },
    { text: "😂", value: "😂" },
    { text: "🔥", value: "🔥" },
  ];

  const {
    deleteMessage,
    forwardMessage,
    replyMessage,
    copyText,
    addReaction,
    editMessage,
    speakText,
  } = messageActions;

  return (
    <Portal>
      <Menu.Positioner>
        <Menu.Content css={scrollCSS} rounded="md" w="210px">
          <Flex justifyContent="center" mb="5px" gap="1">
            {quickReactArray.map((item) => (
              <Menu.Item
                key={item.value}
                value={item.value}
                _hover={{
                  bg: "bg.emphasized",
                }}
                gap="1"
                w="45px"
                h="45px"
                bg="bg.muted"
                fontSize="2xl"
                rounded="md"
                flexDirection="column"
                justifyContent="center"
              >
                <Image src={getEmojiUrl(item.value)} h="22px" w="22px" />
              </Menu.Item>
            ))}
          </Flex>
          <Menu.Item
            p="10px"
            color="fg.muted"
            justifyContent="space-between"
            rounded="md"
            value="addReaction"
          >
            <Text color="fg">{addReaction}</Text> <FaSmile size={18} />
          </Menu.Item>

          <Menu.Separator />

          <Menu.Item
            p="10px"
            color="fg.muted"
            justifyContent="space-between"
            rounded="md"
            value="replyMessage"
          >
            <Text color="fg">{replyMessage}</Text> <HiReply size={18} />
          </Menu.Item>

          <Menu.Item
            p="10px"
            color="fg.muted"
            justifyContent="space-between"
            rounded="md"
            value="forwardMessage"
          >
            <Text color="fg">{forwardMessage}</Text>{" "}
            <HiReply style={{ transform: "scaleX(-1)" }} size={18} />
          </Menu.Item>

          {isMine && hasText && (
            <Menu.Item
              p="10px"
              color="fg.muted"
              justifyContent="space-between"
              rounded="md"
              value="editMessage"
            >
              <Text color="fg">{editMessage}</Text> <BiSolidPencil size={20} />
            </Menu.Item>
          )}

          {hasText && (
            <>
              <Menu.Separator />

              <Menu.Item
                p="10px"
                color="fg.muted"
                justifyContent="space-between"
                rounded="md"
                value="copyText"
              >
                <Text color="fg">{copyText}</Text> <IoCopy size={18} />
              </Menu.Item>

              <Menu.Item
                p="10px"
                color="fg.muted"
                justifyContent="space-between"
                rounded="md"
                value="speakText"
              >
                <Text color="fg">{speakText}</Text> <HiSpeakerphone size={18} />
              </Menu.Item>
            </>
          )}

          {isMine && (
            <>
              <Menu.Separator />

              <Menu.Item
                p="10px"
                justifyContent="space-between"
                rounded="md"
                value="deleteMessage"
                color="fg.error"
                _hover={{ bg: "bg.error", color: "fg.error" }}
              >
                {deleteMessage} <MdDelete size={19} />
              </Menu.Item>
            </>
          )}
        </Menu.Content>
      </Menu.Positioner>
    </Portal>
  );
};

const MessageActionToolbar = ({
  handleInitiateReply,
}: {
  handleInitiateReply: () => void;
}) => {
  const quickReactArray = [
    { text: "👍", value: "👍" },
    { text: "❤️", value: "❤️" },
    { text: "😂", value: "😂" },
  ];

  return (
    <Float offsetX="200px">
      <Flex
        gap="2px"
        border="1px solid"
        borderColor="bg.emphasized"
        p="2px"
        bg="bg"
        rounded="lg"
        alignItems="center"
      >
        {quickReactArray.map((emoji, index) => (
          <Flex
            key={index}
            alignItems="center"
            justifyContent="center"
            _hover={{
              bg: "bg.muted",
            }}
            transition="transform 0.1s ease"
            w="30px"
            h="30px"
            p="3px"
            rounded="sm"
            className="group"
          >
            <Image
              _groupHover={{
                h: "22px",
                w: "22px",
              }}
              src={getEmojiUrl(emoji.value)}
              height="20px"
              w="20px"
            />
          </Flex>
        ))}

        <Separator orientation="vertical" h="5" />

        {/*Reaction */}

        <MessageItemEmojiReact>
          <Flex
            alignItems="center"
            justifyContent="center"
            w="30px"
            h="30px"
            p="3px"
            bg="transparent"
            _hover={{ bg: "bg.muted" }}
            transition="0.2s ease"
            rounded="sm"
            className="group"
            cursor="pointer"
          >
            <Flex
              as={FaSmile}
              fontSize="20px"
              color="fg.muted"
              transition="transform 0.1s ease"
              _groupHover={{
                transform: "scale(1.1)",
              }}
            />
          </Flex>
        </MessageItemEmojiReact>

        {/*Reply */}
        <Flex
          onClick={handleInitiateReply}
          alignItems="center"
          justifyContent="center"
          w="30px"
          h="30px"
          p="3px"
          bg="transparent"
          _hover={{ bg: "bg.muted" }}
          transition="0.2s ease"
          rounded="sm"
          className="group"
          cursor="pointer"
        >
          <Flex
            as={HiReply}
            fontSize="20px"
            color="fg.muted"
            transition="transform 0.1s ease"
            _groupHover={{
              transform: "scale(1.1)",
            }}
          />
        </Flex>

        {/*Forward */}
        <Flex
          alignItems="center"
          justifyContent="center"
          w="30px"
          h="30px"
          p="3px"
          bg="transparent"
          _hover={{ bg: "bg.muted" }}
          transition="0.2s ease"
          rounded="sm"
          className="group"
          cursor="pointer"
          transform="scaleX(-1)"
        >
          <Flex
            as={HiReply}
            fontSize="20px"
            color="fg.muted"
            transition="transform 0.1s ease"
            _groupHover={{
              transform: "scale(1.1)",
            }}
          />
        </Flex>

        {/*More */}
        <Flex
          alignItems="center"
          justifyContent="center"
          w="30px"
          h="30px"
          p="3px"
          bg="transparent"
          _hover={{ bg: "bg.muted" }}
          transition="0.2s ease"
          rounded="md"
          className="group"
          cursor="pointer"
        >
          <Flex
            as={BsThreeDots}
            fontSize="20px"
            color="fg.muted"
            transition="transform 0.1s ease"
            _groupHover={{
              transform: "scale(1.1)",
            }}
          />
        </Flex>
      </Flex>
    </Float>
  );
};

const MessageItemContainer = ({
  senderProfile,
  message,
  showSimpleStyle,
  messageActions,
  isMine,
  getUploadingFilesText,
}: {
  senderProfile: IUser | undefined;
  message: IMessage;
  showSimpleStyle: boolean;
  messageActions: MessageActionTranslations;
  getUploadingFilesText: (attachments: Attachment[]) => string;
  isMine: boolean;
}) => {
  const hasText =
    message.type === "default" && !!message.text && message.text.length > 0;

  const [showMessageActionToolbar, setShowMessageActionToolbar] =
    useState(false);

  const isUploading =
    message.type === "default" &&
    message.status === "sending" &&
    (message.attachments?.length ?? 0) > 0;

  const displayAttachmentFullscreen = (fileId: string) => {
    if (
      message.type === "default" &&
      message.attachments &&
      message.attachments.length > 0
    ) {
      const visualAttachments = message.attachments.filter(
        (p) => p.type === "video" || p.type === "image",
      );

      const findAttachmentClicked = visualAttachments.find(
        (p) => p.fileId === fileId,
      );

      const arrangedArray = findAttachmentClicked
        ? [
            findAttachmentClicked,
            ...visualAttachments.filter((p) => p.fileId !== fileId),
          ]
        : visualAttachments;

      const id = "showAttachmentId";

      createDialog.open(id, {
        contentWidth: "100%",
        contentRounded: "0px",
        dialogSize: "full",
        showCloseButton: false,
        showBackDrop: true,
        contentHeight: "100%",
        bodyPadding: "0px",

        contentBg: "transparent",
        content: (
          <Suspense>
            <AttachmentFullScreenUI
              attachments={arrangedArray}
              createdAt={message.createdAt}
              senderProfile={senderProfile}
            />
          </Suspense>
        ),
      });
    }
  };

  const handleInitiateReply = () => {
    if (message.status === "sending") return;

    initiateReplyTo({
      conversationId: message.conversationId,
      messageId: message._id,
    });
  };

  const handleMenuValueSelect = (event: MenuSelectionDetails) => {
    const value = event.value;

    switch (value) {
      case "replyMessage":
        handleInitiateReply();
        break;
    }
  };

  return (
    <Flex
      onMouseEnter={() => setShowMessageActionToolbar(true)}
      onMouseLeave={() => setShowMessageActionToolbar(false)}
      color={message.status === "sending" ? "fg.muted" : ""}
      w="full"
      className="messageItem"
      mb="5px"
      alignItems="start"
      id={message._id}
      pos="relative"
    >
      {/* Profile */}
      <Flex
        justifyContent="center"
        alignItems="center"
        h={
          showSimpleStyle
            ? message.isReplied
              ? "70px"
              : "25px"
            : message.isReplied
              ? "75px"
              : "50px"
        }
        minW={{ base: "16%", lg: "7%" }}
        maxW={{ base: "16%", lg: "7%" }}
        direction="column"
        alignSelf="stretch"
        gap="3px"
      >
        {message.isReplied && (
          <Flex minW="full" maxW="full" justifyContent="flex-end">
            <Flex
              w="50%"
              p="1px"
              h="12px"
              borderColor="fg.muted"
              _hover={{
                borderColor: "fg",
              }}
              roundedTopLeft="8px"
              borderLeftWidth="2.5px"
              borderTopWidth="2px"
            />
          </Flex>
        )}

        {!showSimpleStyle && (
          <Avatar.Root>
            <Avatar.Fallback>
              <BsRobot />
            </Avatar.Fallback>
          </Avatar.Root>
        )}

        {showSimpleStyle && (
          <Text userSelect="none" cursor="pointer" fontSize="xs">
            {formatDateSimpleStyle(message.createdAt)}{" "}
          </Text>
        )}
      </Flex>

      {/*Content */}
      <Flex w="full" direction="column">
        {message.isReplied && (
          <P2PMessageReplyUI replyToMessage={message.replyTo} />
        )}

        {!showSimpleStyle && (
          <Flex gap="5px" alignItems="center">
            <Text
              _hover={{
                textDecoration: "underline",
              }}
              cursor="pointer"
              color="fg.muted"
              fontWeight="600"
            >
              {senderProfile?.displayName || "Deleted User"}
            </Text>

            <ShowFullTimeStampTooltip createdAt={message.createdAt}>
              <Text
                color="gray.fg"
                fontWeight="normal"
                cursor="pointer"
                fontSize="xs"
              >
                {formatMessageTimestamp(message.createdAt)}
              </Text>
            </ShowFullTimeStampTooltip>
          </Flex>
        )}

        <Menu.Root onSelect={handleMenuValueSelect}>
          <Menu.ContextTrigger minW="full" asChild>
            <Flex direction="column" w="full">
              {message.type === "default" && !isUploading && message.text && (
                <MessageTextRenderer text={message.text} />
              )}

              {isUploading && message.attachments && (
                <UploadingFilesUI
                  text={getUploadingFilesText(message.attachments)}
                />
              )}

              {!isUploading &&
                message.type === "default" &&
                message.attachments &&
                message.attachments.length > 0 && (
                  <MessageAttachmentRenderer
                    attachments={message.attachments}
                    displayAttachmentFullscreen={displayAttachmentFullscreen}
                  />
                )}
            </Flex>
          </Menu.ContextTrigger>

          <MessageActionMenuItems
            hasText={hasText}
            isMine={isMine}
            messageActions={messageActions}
          />
        </Menu.Root>
      </Flex>

      {showMessageActionToolbar && (
        <MessageActionToolbar handleInitiateReply={handleInitiateReply} />
      )}
    </Flex>
  );
};

export default MessageItemContainer;
