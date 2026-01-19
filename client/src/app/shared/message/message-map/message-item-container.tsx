import {
  Avatar,
  ButtonGroup,
  Flex,
  Float,
  IconButton,
  Menu,
  Portal,
  Separator,
  Text,
  type MenuSelectionDetails,
} from "@chakra-ui/react";
import type { IMessage, IUser } from "../../../../types/schema";
import type { MessageActionTranslations } from "../../../../types";
import {
  copyText,
  formatDateSimpleStyle,
  formatMessageTimestamp,
} from "../../../../utils/chatFunctions";
import ShowFullTimeStampTooltip from "../show-full-createdAt-tooltip";
import { memo, useId } from "react";
import MessageTextRenderer from "./message-text-item";
import { FaSmile } from "react-icons/fa";
import { HiOutlineReply, HiReply, HiSpeakerphone } from "react-icons/hi";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoCopy } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { BiSolidPencil } from "react-icons/bi";
import { Tooltip } from "../../../../components/ui/tooltip";

export type ActionMenuOnselectTypes =
  | "addReaction"
  | "replyMessage"
  | "copyText"
  | "speakText"
  | "deleteMessage"
  | "editMessage";

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

const SenderProfileDisplay = ({ senderProfile }: { senderProfile: IUser }) => {
  return (
    <Avatar.Root rounded="md" size="sm">
      <Avatar.Fallback
        name={senderProfile?.displayName || "This user is Deleted"}
      />
      {senderProfile.profile?.profilePic && (
        <Avatar.Image src={senderProfile.profile.profilePic} />
      )}
    </Avatar.Root>
  );
};

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
                {item.text}
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

          {isMine && (
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

          <Menu.Separator />

          {hasText && (
            <Menu.Item
              p="10px"
              color="fg.muted"
              justifyContent="space-between"
              rounded="md"
              value="copyText"
            >
              <Text color="fg">{copyText}</Text> <IoCopy size={18} />
            </Menu.Item>
          )}

          <Menu.Item
            p="10px"
            color="fg.muted"
            justifyContent="space-between"
            rounded="md"
            value="speakText"
          >
            <Text color="fg">{speakText}</Text> <HiSpeakerphone size={18} />
          </Menu.Item>

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

const MessageActionToolBar = ({
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
  ];

  const { addReaction, replyMessage, forwardMessage, moreText } =
    messageActions || {};

  const triggerId = useId();

  return (
    <Float offsetX="10rem" placement="top-end">
      <ButtonGroup
        opacity={0}
        css={{
          "[data-message-container]:hover &": {
            opacity: { lg: "100" },
          },
        }}
        size="sm"
        bg="bg"
        border="1px solid"
        borderColor="bg.muted"
        attached
        rounded="md"
        boxShadow="sm"
      >
        {quickReactArray.map((react) => (
          <IconButton
            fontSize="lg"
            focusRing="none"
            key={react.value}
            variant="ghost"
          >
            {react.text}
          </IconButton>
        ))}

        <Separator ml="2px" mr="2px" orientation="vertical" h="30px" />

        <Tooltip
          openDelay={100}
          closeDelay={100}
          showArrow
          positioning={{ placement: "top" }}
          contentProps={{
            css: { "--tooltip-bg": "colors.bg", p: "10px", color: "fg.muted" },
          }}
          content={addReaction}
        >
          <IconButton focusRing="none" variant="ghost">
            <FaSmile style={{ width: "20px", height: "20px" }} />
          </IconButton>
        </Tooltip>

        <Tooltip
          openDelay={100}
          closeDelay={100}
          showArrow
          positioning={{ placement: "top" }}
          contentProps={{
            css: { "--tooltip-bg": "colors.bg", p: "10px", color: "fg.muted" },
          }}
          content={replyMessage}
        >
          <IconButton focusRing="none" variant="ghost">
            <HiOutlineReply style={{ width: "20px", height: "20px" }} />
          </IconButton>
        </Tooltip>

        <Tooltip
          openDelay={100}
          closeDelay={100}
          showArrow
          positioning={{ placement: "top" }}
          contentProps={{
            css: { "--tooltip-bg": "colors.bg", p: "10px", color: "fg.muted" },
          }}
          content={forwardMessage}
        >
          <IconButton focusRing="none" variant="ghost">
            <HiOutlineReply
              style={{ width: "20px", height: "20px", transform: "scaleX(-1)" }}
            />
          </IconButton>
        </Tooltip>

        <Menu.Root ids={{ trigger: triggerId }} unmountOnExit lazyMount>
          <Tooltip
            ids={{ trigger: triggerId }}
            openDelay={100}
            closeDelay={100}
            showArrow
            positioning={{ placement: "top" }}
            contentProps={{
              css: {
                "--tooltip-bg": "colors.bg",
                p: "10px",
                color: "fg.muted",
              },
            }}
            content={moreText}
          >
            <Menu.Trigger asChild>
              <IconButton focusRing="none" variant="ghost">
                <FiMoreHorizontal style={{ width: "20px", height: "20px" }} />
              </IconButton>
            </Menu.Trigger>
          </Tooltip>

          <MessageActionMenuItems
            hasText={hasText}
            isMine={isMine}
            messageActions={messageActions}
          />
        </Menu.Root>
      </ButtonGroup>
    </Float>
  );
};

const MessageItemContainer = ({
  message,
  senderProfile,
  showSimpleStyle,
  isMine,
  messageActions,
  getUploadingFilesText,
}: {
  message: IMessage;
  senderProfile: IUser | undefined;
  showSimpleStyle: boolean;
  isMine: boolean;
  messageActions: MessageActionTranslations;
  getUploadingFilesText: (count: number) => string;
}) => {
  const formatedTimeStampLong = formatMessageTimestamp(message.createdAt);

  const hasText =
    message.type === "text"
      ? !!message.text?.length
      : message.type === "media" || message.type === "document"
        ? !!message.caption?.length
        : false;

  const handleMenuSelect = (event: MenuSelectionDetails) => {
    const text = event.value as ActionMenuOnselectTypes;

    switch (text) {
      case "addReaction":
        console.log(text);
        break;
      case "replyMessage":
        console.log(text);
        break;
      case "copyText":
        const messageText =
          message.type === "text"
            ? message.text
            : message.type === "document" || message.type === "media"
              ? message.caption
              : "";

        if (messageText) {
          copyText(messageText);
        }
        break;
      case "speakText":
        console.log(text);
        break;
      case "deleteMessage":
        console.log(text);
        break;
      case "editMessage":
        console.log(text);
        break;
    }
  };

  return (
    <Flex
      mb={showSimpleStyle ? "0px" : "5px"}
      minW="full"
      alignContent="flex-start"
      _hover={{
        bg: "bg.muted",
      }}
      color={message.status === "sending" ? "fg.muted" : ""}
      _active={{
        bg: "bg.muted",
      }}
      rounded="sm"
      pos="relative"
      data-message-container
      minH={showSimpleStyle ? "25px" : "auto"}
    >
      <Flex
        w={{ lg: "7%", base: "10%" }}
        fontSize="12.5px"
        color="fg.muted"
        userSelect="none"
        alignItems="start"
        justifyContent="center"
        pt={showSimpleStyle ? "2px" : "7px"}
      >
        {!showSimpleStyle && senderProfile && (
          <SenderProfileDisplay senderProfile={senderProfile} />
        )}

        {showSimpleStyle && (
          <Text
            opacity={0}
            _groupHover={{
              opacity: 100,
            }}
          >
            {formatDateSimpleStyle(message.createdAt)}
          </Text>
        )}
      </Flex>

      <Flex gap="0px" flex={1} flexDir="column">
        {!showSimpleStyle && (
          <Flex gap="5px" alignItems="center">
            <Text cursor="pointer">{senderProfile?.displayName}</Text>
            <ShowFullTimeStampTooltip createdAt={message.createdAt}>
              <Text
                cursor="pointer"
                color="fg.muted"
                _hover={{
                  textDecoration: "underline",
                }}
                userSelect="none"
                fontSize="xs"
              >
                {formatedTimeStampLong}
              </Text>
            </ShowFullTimeStampTooltip>
          </Flex>
        )}

        <Menu.Root onSelect={handleMenuSelect} unmountOnExit lazyMount>
          <Menu.ContextTrigger textAlign="left">
            {/*All Message Content Goes Here */}
            <Flex w="full" direction="column">
              {message.type === "text" && (
                <MessageTextRenderer text={message.text} />
              )}
            </Flex>

            {/*All Message Content Goes Here */}
          </Menu.ContextTrigger>
          <MessageActionMenuItems
            hasText={hasText}
            isMine={isMine}
            messageActions={messageActions}
          />
        </Menu.Root>
      </Flex>

      <MessageActionToolBar
        hasText={hasText}
        isMine={isMine}
        messageActions={messageActions}
      />
    </Flex>
  );
};

export default memo(MessageItemContainer);
