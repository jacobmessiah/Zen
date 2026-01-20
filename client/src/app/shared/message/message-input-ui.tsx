import { CloseButton, Flex, Float, Image, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { LuPlus, LuX } from "react-icons/lu";
import { type Attachment, type DocumentMimeType } from "../../../types/schema";
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
import FileDragUI from "../../dialog/ui/file-drag-ui";
import FileTooLargeUI from "../../dialog/ui/file-too-large";
import { useTranslation } from "react-i18next";
import FileInvalidUI from "../../dialog/ui/file-invalid-ui";

import AttachmentLimitUI from "../../dialog/ui/max-attachment-ui";

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

export const AUDIO_MIME_TYPES = [
  "audio/mpeg", // MP3
  "audio/wav", // WAV
  "audio/ogg", // OGG
  "audio/webm", // WebM
  "audio/flac", // FLAC
  "audio/aac", // AAC
  "audio/mp4", // M4A
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

const getAttachmentType = (type: string) => {
  if (VIDEO_MIME_TYPES.includes(type)) return "video";
  if (IMAGE_MIME_TYPES.includes(type)) return "image";
  if (AUDIO_MIME_TYPES.includes(type)) return "audio";
  if (DOCUMENT_MIME_TYPES.includes(type)) return "document";
  return null;
};

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

const AttachmentPreview = ({
  attachment,
  handleRemoveAttachment,
}: {
  attachment: Attachment;
  handleRemoveAttachment: (fileId: string) => void;
}) => {
  const handleClick = () => {
    handleRemoveAttachment(attachment.fileId);
  };

  return (
    <Flex
      minW="180px"
      maxW="180px"
      minH="180px"
      maxH="180px"
      key={attachment.fileId}
      pos="relative"
      direction="column"
      border="1px solid"
      borderColor="bg.emphasized"
      userSelect="none"
      rounded="md"
      overflow="hidden"
      alignItems="center"
      justifyContent="center"
    >
      <Float offset="5">
        <CloseButton
          onClick={handleClick}
          size="xs"
          rounded="full"
          colorPalette="red"
          variant="solid"
        >
          <LuX style={{ width: "18px", height: "18px" }} />
        </CloseButton>
      </Float>

      <Flex h="80%" justifyContent="center" alignItems="center" w="80%">
        {attachment.type === "image" && (
          <Image
            draggable={false}
            pointerEvents="none"
            maxH="full"
            maxW="full"
            objectFit="contain"
            src={attachment.previewUrl}
          />
        )}
        {attachment.type === "video" && (
          <video
            src={attachment.previewUrl}
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
              pointerEvents: "none",
            }}
            muted
          />
        )}
        {attachment.type === "document" && (
          <Flex alignItems="center" justifyContent="center" color="fg.muted">
            {getDocumentIcon(attachment.mimeType, 80)}
          </Flex>
        )}
      </Flex>

      <Text
        textAlign="center"
        px="2"
        py="2"
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        fontSize="xs"
        w="full"
      >
        {attachment.name}
      </Text>
    </Flex>
  );
};

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
  const MAX_ATTACHMENT = 10;
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

  const [attachments, setAttachments] = useState<Attachment[]>([]);

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

    const iterableFiles = Array.from(files);

    if (attachments.length > MAX_ATTACHMENT) return;

    if (iterableFiles.length > 0 && attachments.length < MAX_ATTACHMENT) {
      setFileInputKey((p) => p + 1);
      for (const file of iterableFiles) {
        if (file.size > MAX_SIZE) {
          // So big file with createDialog
        }

        if (
          VIDEO_MIME_TYPES.includes(file.type) ||
          AUDIO_MIME_TYPES.includes(file.type) ||
          IMAGE_MIME_TYPES.includes(file.type) ||
          DOCUMENT_MIME_TYPES.includes(file.type)
        ) {
          addAttachment(file);
        }
      }
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
    }
  };

  const handleSendMessage = () => {};

  const { t: translate } = useTranslation(["chat"]);

  const addAttachment = (file: File) => {
    const type = getAttachmentType(file.type);
    if (!type) return;

    const url = URL.createObjectURL(file);

    if (type === "video") {
      const newAttachment: Attachment = {
        type: "video",
        previewUrl: url,
        fileId: crypto.randomUUID().slice(0, 15),
        mimeType: file.type as "video/mp4",
        name: file.name,
        size: file.size,
      };

      setAttachments((p) => [...p, newAttachment]);
    }

    if (type === "audio") {
      const newAttachment: Attachment = {
        type: "audio",
        previewUrl: url,
        fileId: crypto.randomUUID().slice(0, 15),
        mimeType: file.type as "audio/mp4",
        name: file.name,
        size: file.size,
      };

      setAttachments((p) => [...p, newAttachment]);
    }

    if (type === "document") {
      const newAttachment: Attachment = {
        type: "document",
        previewUrl: url,
        fileId: crypto.randomUUID().slice(0, 15),
        mimeType: file.type as "application/pdf",
        name: file.name,
        size: file.size,
      };

      setAttachments((p) => [...p, newAttachment]);
    }

    if (type === "image") {
      const newAttachment: Attachment = {
        type: "image",
        previewUrl: url,
        fileId: crypto.randomUUID().slice(0, 15),
        mimeType: file.type as "image/jpeg",
        name: file.name,
        size: file.size,
      };

      setAttachments((p) => [...p, newAttachment]);
    }
  };

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

  const scrollXCss = {
    scrollBehavior: "smooth",
    "&::-webkit-scrollbar": {
      height: "5px",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "fg.muted",
      borderRadius: "full",
    },
  };
  useEffect(() => {
    let dragCounter = 0;
    const dialogId = "bleachIsBetter";

    const onDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter++;
      createDialog.open(dialogId, {
        contentWidth: "300px",
        contentHeight: "180px",
        bodyPadding: "15px",
        showBackDrop: true,
        content: (
          <FileDragUI receiver={selectedConversation?.otherUser.username!} />
        ),
      });
    };

    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter === 0) {
        createDialog.close(dialogId);
      }
    };

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.dataTransfer!.dropEffect = "copy";
    };

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      createDialog.close(dialogId);

      const files = e.dataTransfer?.files;

      if (!files) return;
      if (Array.isArray(files) && files.length < 1) return;

      const iterableFiles = Array.from(files);

      if (attachments.length + files.length > MAX_ATTACHMENT) {
        createDialog.open(dialogId, {
          contentWidth: "md",
          bodyPadding: "15px",
          showBackDrop: true,
          showCloseButton: true,
          closeButtonText: translate("IunderstandText"),
          content: <AttachmentLimitUI max={MAX_ATTACHMENT} />,
        });
        return;
      }

      iterableFiles.forEach((file) => {
        if (file.size > MAX_SIZE) {
          // So big file with createDialog
          createDialog.open(dialogId, {
            contentWidth: "md",
            bodyPadding: "15px",
            showBackDrop: true,
            showCloseButton: true,
            closeButtonText: translate("IunderstandText"),
            content: <FileTooLargeUI />,
          });
          return;
        }

        if (
          !DOCUMENT_MIME_TYPES.includes(file.type) &&
          !AUDIO_MIME_TYPES.includes(file.type) &&
          !IMAGE_MIME_TYPES.includes(file.type) &&
          !VIDEO_MIME_TYPES.includes(file.type)
        ) {
          // Unsupported file type with createDialog
          createDialog.open(dialogId, {
            contentWidth: "md",
            bodyPadding: "15px",
            showBackDrop: true,
            showCloseButton: true,
            closeButtonText: translate("IunderstandText"),
            content: <FileInvalidUI />,
          });
          return;
        }

        addAttachment(file);
      });
    };

    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("drop", onDrop);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("dragover", onDragOver);

    return () => {
      window.removeEventListener("drop", onDrop);
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("dragover", onDragOver);
    };
  }, [attachments]);

  useEffect(() => {
    const dialogId = "IchigoBetterThanNaruto";

    const handleOnPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const files = Array.from(items)
        .filter((p) => p.kind === "file")
        .map((p) => p.getAsFile())
        .filter(Boolean) as File[];

      if (Array.isArray(files) && files.length > 0) {
        e.preventDefault();

        if (attachments.length + files.length > MAX_ATTACHMENT) {
          createDialog.open(dialogId, {
            contentWidth: "md",
            bodyPadding: "15px",
            showBackDrop: true,
            showCloseButton: true,
            closeButtonText: translate("IunderstandText"),
            content: <AttachmentLimitUI max={MAX_ATTACHMENT} />,
          });
          return;
        }

        for (const file of files) {
          if (file.size > MAX_SIZE) {
            // So big file with createDialog
            createDialog.open(dialogId, {
              contentWidth: "md",
              bodyPadding: "15px",
              showBackDrop: true,
              showCloseButton: true,
              closeButtonText: translate("IunderstandText"),
              content: <FileTooLargeUI />,
            });
            return;
          }

          if (
            !DOCUMENT_MIME_TYPES.includes(file.type) &&
            !AUDIO_MIME_TYPES.includes(file.type) &&
            !IMAGE_MIME_TYPES.includes(file.type) &&
            !VIDEO_MIME_TYPES.includes(file.type)
          ) {
            // Unsupported file type with createDialog
            createDialog.open(dialogId, {
              contentWidth: "md",
              bodyPadding: "15px",
              showBackDrop: true,
              showCloseButton: true,
              closeButtonText: translate("IunderstandText"),
              content: <FileInvalidUI />,
            });
            return;
          }

          if (
            VIDEO_MIME_TYPES.includes(file.type) ||
            AUDIO_MIME_TYPES.includes(file.type) ||
            IMAGE_MIME_TYPES.includes(file.type) ||
            DOCUMENT_MIME_TYPES.includes(file.type)
          ) {
            addAttachment(file);
          }
        }
      }
    };

    window.addEventListener("paste", handleOnPaste);
    return () => window.removeEventListener("paste", handleOnPaste);
  }, [attachments]);

  const handleRemoveAttachment = (fileId: string) => {
    setAttachments((p) => p.filter((att) => att.fileId !== fileId));
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
        {attachments.length > 0 && (
          <Flex
            maxW="full"
            overflow="auto"
            css={scrollXCss}
            p="10px"
            w="full"
            gap="10px"
          >
            {attachments.map((attachment) => (
              <AttachmentPreview
                handleRemoveAttachment={handleRemoveAttachment}
                key={attachment.fileId}
                attachment={attachment}
              />
            ))}
          </Flex>
        )}
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
