import { Flex } from "@chakra-ui/react";
import { useRef, useState, type ChangeEvent } from "react";
import { LuPlus } from "react-icons/lu";
import { type DocumentMimeType } from "../../../types/schema";
import { FaFilePdf, FaFilePowerpoint } from "react-icons/fa6";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { IoDocumentText } from "react-icons/io5";
import { BiSolidFileTxt } from "react-icons/bi";
import userAuthStore from "../../../store/user-auth-store";
import userChatStore from "../../../store/user-chat-store";
import { FaMicrophone } from "react-icons/fa";
import { BsEmojiExpressionlessFill } from "react-icons/bs";
import EmojiGif from "../emoji-gif";
import { P2PChatIndicator } from "../activity-indicator";
import { createDialog } from "../../dialog/create-dialog";

export const DOCUMENT_MIME_TYPES: string[] = [
  "application/pdf", // PDF
  "application/msword", // Word DOC
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Word DOCX
  "application/vnd.ms-excel", // Excel XLS
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel XLSX
  "application/vnd.ms-powerpoint", // PowerPoint PPT
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PowerPoint PPTX
  "text/plain", // TXT
];

export const IMAGE_MIME_TYPES: string[] = [
  "image/jpeg", // JPG / JPEG
  "image/png", // PNG
  "image/webp", // WebP
  "image/gif", // GIF
  "image/avif", // AVIF
];

export const VIDEO_MIME_TYPES: string[] = [
  "video/mp4", // MP4
  "video/webm", // WebM
  "video/ogg", // OGG
  "video/quicktime", // MOV
];

export function getDocumentIcon(arg: DocumentMimeType, size: number) {
  switch (arg) {
    case "application/pdf":
      return <FaFilePdf size={size} />;
    case "application/msword":
      return <IoDocumentText size={size} />;
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return <IoDocumentText size={size} />;
    case "application/vnd.ms-excel":
      return <PiMicrosoftExcelLogoFill size={size} />;
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return <IoDocumentText size={size} />;
    case "application/vnd.ms-powerpoint":
      return <FaFilePowerpoint size={size} />;
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return <FaFilePowerpoint size={size} />;
    case "text/plain":
      return <BiSolidFileTxt size={size} />;
  }
}

const MessageInputUI = ({ inputPlaceHolder }: { inputPlaceHolder: string }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const MIN_HEIGHT = 45;
  const [fileInputKey, setFileInputKey] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const selectedConversation = userChatStore(
    (state) => state.selectedConversation,
  );

  const MAX_SIZE = 15 * 1024 * 1024;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_MESSAGE_LENGTH = 2000;

  const socket = userAuthStore((state) => state.socket);

  const [isTyping, setIsTyping] = useState(false);

  const MAX_ATTACHMENT = 30;

  const TYPING_SEND_INTERVAL_MS = 3000;

  const sendTypingEvent = () => {
    if (isTyping) return;
    setIsTyping(true);
    if (socket && selectedConversation?.otherUser) {
      socket.emit("typingevent", { to: selectedConversation.otherUser._id });

      setTimeout(() => {
        setIsTyping(false);
      }, TYPING_SEND_INTERVAL_MS);
    }
  };

  const handleOnchange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;

    if (value.length > MAX_MESSAGE_LENGTH) return;
    setInputValue(value);

    if (!isTyping) {
      sendTypingEvent();
    }
  };

  const handleOnFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;
    if (files.length < 1) return;

    const iteratableFiles = Array.from(files);

    createDialog.open("intl", {
      title: "Dialog Title",
      description: "Dialog Description",
    });
  };

  const handleSendMessage = () => {};

  const scrollYCss = {
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
  };

  return (
    <Flex
      alignItems="center"
      minW="full"
      maxW="full"
      pb={{ base: "0px", lg: "10px", md: "10px" }}
      direction="column"
      px="1.5"
    >
      <P2PChatIndicator
        displayName={selectedConversation?.otherUser.displayName}
        userId={selectedConversation?.otherUser._id}
      />
      <Flex
        alignItems="flex-end"
        rounded="lg"
        border="1px solid"
        borderColor="bg.emphasized"
        minW="full"
        maxW="full"
        maxH="17lh"
        overflowY="auto"
        flexDir="column"
        css={scrollYCss}
      >
        <input
          onChange={handleOnFileChange}
          type="file"
          hidden
          multiple
          key={fileInputKey}
          ref={fileInputRef}
        />

        {/*Attachment Container */}

        {/*Attachment Container */}

        <Flex gap="1" pb="10px" pr="5px" alignItems="flex-end" w="full">
          <Flex w={{ lg: "6.5%" }} justifyContent="center">
            <Flex
              onClick={() => fileInputRef.current?.click()}
              alignItems="center"
              justifyContent="center"
              h="35px"
              w="35px"
              rounded="lg"
              _hover={{ bg: "bg.emphasized" }}
            >
              <LuPlus size={25} />
            </Flex>
          </Flex>

          <Flex flex={1}>
            <textarea
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.repeat) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              ref={textAreaRef}
              style={{
                minHeight: `${MIN_HEIGHT}px`,
                paddingTop: "16px",
                fieldSizing: "content",
                resize: "none",
                width: "100%",
                lineHeight: "1.5",
                background: "none",
                fontSize: "15px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
              className="no-focus"
              value={inputValue}
              onChange={handleOnchange}
              placeholder={inputPlaceHolder}
            />
          </Flex>

          <Flex gap="5px" alignItems="flex-end">
            <Flex
              alignItems="center"
              justifyContent="center"
              h="35px"
              w="35px"
              rounded="lg"
              _hover={{ bg: "bg.emphasized" }}
            >
              <FaMicrophone />
            </Flex>

            <EmojiGif showTabOff="gif" onEmojiSelect={(e) => console.log(e)}>
              <Flex
                alignItems="center"
                justifyContent="center"
                h="35px"
                w="35px"
                rounded="lg"
                _hover={{ bg: "bg.emphasized" }}
              >
                <BsEmojiExpressionlessFill size={20} />
              </Flex>
            </EmojiGif>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MessageInputUI;
