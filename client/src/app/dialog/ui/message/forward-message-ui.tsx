import type { ConnectionType, IMessage } from "@/types/schema";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CloseButton,
  Flex,
  Heading,
  Input,
  InputGroup,
  Text,
  type SystemStyleObject,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { createDialog } from "../../create-dialog";
import { FaSearch } from "react-icons/fa";

import { getEmojiUrl } from "@/utils/chatFunctions";
import { IoMdImage } from "react-icons/io";
import { RiAttachment2 } from "react-icons/ri";
import { HiGif } from "react-icons/hi2";
import userConnectionStore from "@/store/user-connections-store";
import { BsRobot } from "react-icons/bs";
import { ConversationActivityIndicator } from "@/app/shared/activity-indicator";
import { useState } from "react";
import { IoSend } from "react-icons/io5";

const MessageTextRenderer = ({
  text,
  maxH,
}: {
  text: string;
  maxH: string;
}) => {
  const emojiRegex =
    /(\p{RI}\p{RI}|\p{Emoji_Presentation}|\p{Emoji}\uFE0F)(?:\u200D(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F))*/gu;

  const parts = text.split(emojiRegex);

  const showBig = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F){1,7}$/u.test(
    text.trim(),
  );

  return (
    <Box
      wordBreak="break-word"
      fontWeight="400"
      fontSize="13px"
      lineHeight="1.5"
      whiteSpace="pre-wrap"
      overflowWrap="anywhere"
      color="gray.700"
      _dark={{
        color: "gray.100",
      }}
      letterSpacing="0.01em"
      pb="5px"
      userSelect="text"
      lineClamp={3}
      maxH={maxH}
    >
      {parts.map((part, index) => {
        if (part.match(emojiRegex)) {
          return (
            <span className="emojiContainer">
              <img
                draggable={false}
                onError={(e) => (e.currentTarget.style.display = "none")}
                className="emoji"
                src={getEmojiUrl(part)}
                width={showBig ? "45px" : "22px"}
                height={showBig ? "45px" : "22px"}
                style={{
                  display: "inline-block",
                  verticalAlign: "middle",

                  objectFit: "contain",
                }}
              />
            </span>
          );
        } else if (part) {
          return <span key={index}>{part}</span>;
        }
        return null;
      })}
    </Box>
  );
};

const ForwardMessagePreview = ({
  message,
  mediaText,
  fileText,
}: {
  message: IMessage;
  mediaText: string;
  fileText: string;
}) => {
  const HasAttachmentIndicator = () => {
    if (
      message.type === "default" &&
      message.attachments &&
      message.attachments.length > 0
    ) {
      const attachments = message.attachments;
      const visualAtt = attachments.filter(
        (p) => p.type === "video" || p.type === "image",
      );

      const files = attachments.filter(
        (p) => p.type === "audio" || p.type === "document",
      );

      if (visualAtt && visualAtt.length > 0) {
        const text = visualAtt.length > 1 ? `${mediaText}s` : `${mediaText}`;
        return (
          <Flex alignItems="center" gap="5px">
            <IoMdImage size={20} />
            <Text>
              {visualAtt.length} {text}
            </Text>
          </Flex>
        );
      }

      if (files && files.length > 0) {
        const text = files.length > 1 ? `${fileText}s` : `${fileText}`;

        return (
          <Flex alignItems="center" gap="5px">
            <RiAttachment2 size={20} />
            <Text>
              {files.length} {text}
            </Text>
          </Flex>
        );
      }
    } else {
      return null;
    }
  };

  return (
    <Flex w="full" maxH="80px">
      <Flex
        w="full"
        pl="5px"
        borderLeft="2px solid"
        borderColor="fg.muted"
        alignItems="center"
        justifyContent="space-between"
      >
        {message.type === "default" && (
          <Flex color="fg.muted" gap="8px" direction="column">
            {message.text && message.text.length > 0 && (
              <MessageTextRenderer
                maxH={
                  Array.isArray(message.attachments) &&
                  message.attachments.length > 0
                    ? "40px"
                    : "70px"
                }
                text={message.text}
              />
            )}
            <HasAttachmentIndicator />
          </Flex>
        )}
        {message.type === "gif" && (
          <Flex alignItems="center" w="full" justifyContent="space-between">
            <HiGif size={25} />

            <video
              className="isLoading"
              src={message.gif.preview}
              height="60px"
              width="60px"
              style={{
                objectFit: "cover",
                borderRadius: "15px",
              }}
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

const ForwardMessageUI = ({ message }: { message: IMessage }) => {
  const scrollCSS: SystemStyleObject = {
    scrollBehavior: "smooth",
    "&::-webkit-scrollbar": {
      width: "5px",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "fg.muted",
      borderRadius: "full",
    },
  };
  const { t: translate } = useTranslation(["chat"]);

  const {
    headerText,
    descriptionText,
    searchText,
    sendText,
    cancelText,
    mediaText,
    fileText,
  } = translate("ForwardMessageUI") as unknown as {
    headerText: string;
    descriptionText: string;
    searchText: string;
    mediaText: string;
    fileText: string;
    cancelText: string;
    sendText: string;
  };

  const handleClose = () => {
    const forwardToId = "forwardToUI";
    createDialog.close(forwardToId);
  };

  const connections = userConnectionStore((state) => state.connections);

  const [selectedConversations, setSelectedConversations] = useState<
    ConnectionType[]
  >([]);

  const handleSelect = (connection: ConnectionType) => {
    const checked = selectedConversations.some((c) => c._id === connection._id);

    if (checked) {
      setSelectedConversations((prev) =>
        prev.filter((c) => c._id !== connection._id),
      );
    } else {
      setSelectedConversations((prev) => [...prev, connection]);
    }
  };

  const sendTextT =
    selectedConversations.length > 1
      ? `${sendText} (${selectedConversations.length})`
      : sendText;

  return (
    <Flex pb="10px" pt="5px" w="full" h="full" direction="column">
      <Flex
        px="15px"
        w="full"
        alignItems="center"
        justifyContent="space-between"
      >
        <Heading>{headerText}</Heading>
        <CloseButton focusRing="none" rounded="xl" onClick={handleClose} />
      </Flex>
      <Flex px="15px" mb="10px" w="full">
        <Text>{descriptionText}</Text>
      </Flex>

      <Flex px="15px">
        <InputGroup startElement={<FaSearch />}>
          <Input w="full" rounded="lg" placeholder={searchText} />
        </InputGroup>
      </Flex>

      <Flex
        css={scrollCSS}
        overflow="auto"
        maxH={{ base: "400px", lg: "250px" }}
        direction="column"
        gap="5px"
        flex={1}
        px="10px"
        alignItems="center"
        py="8px"
      >
        {connections.length > 0 &&
          connections.map((connection) => {
            const user = connection.otherUser;

            if (!user) return null;

            return (
              <Flex
                onClick={() => handleSelect(connection)}
                p="5px"
                pl="10px"
                pr="15px"
                justifyContent="space-between"
                rounded="lg"
                key={connection._id}
                w="full"
                _hover={{ bg: "bg.muted" }}
              >
                <Flex gap="15px" alignItems="center">
                  <Flex pos="relative">
                    {/*Alert setup profile pic here */}
                    <Avatar.Root size="xs">
                      <Avatar.Fallback>
                        <BsRobot />
                      </Avatar.Fallback>
                    </Avatar.Root>

                    <ConversationActivityIndicator
                      userId={connection.otherUser._id}
                    />
                  </Flex>

                  <Flex direction="column">
                    <Text fontWeight="600">{user.displayName}</Text>
                    <Text color="fg.muted">{user.username}</Text>
                  </Flex>
                </Flex>

                <Checkbox.Root
                  checked={selectedConversations.some(
                    (c) => c._id === connection._id,
                  )}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control rounded="md" />
                </Checkbox.Root>
              </Flex>
            );
          })}
      </Flex>

      <Flex
        direction="column"
        p="8px"
        borderTop="1px solid"
        borderColor="bg.emphasized"
      >
        <ForwardMessagePreview
          fileText={fileText}
          mediaText={mediaText}
          message={message}
        />
      </Flex>
      <Flex px="10px" w="full" gap="10px">
        <Button onClick={handleClose} variant="subtle" flex={1} rounded="lg">
          {cancelText}
        </Button>
        <Button
          disabled={selectedConversations.length < 1}
          flex={1}
          rounded="lg"
        >
          {sendTextT} <IoSend />
        </Button>
      </Flex>
    </Flex>
  );
};

export default ForwardMessageUI;
