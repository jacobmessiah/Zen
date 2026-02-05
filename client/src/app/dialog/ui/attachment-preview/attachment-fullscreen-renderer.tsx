import { Tooltip } from "@/components/ui/tooltip";
import {
  Avatar,
  Badge,
  Flex,
  FormatByte,
  LocaleProvider,
  Menu,
  Text,
  type MenuSelectionDetails,
} from "@chakra-ui/react";
import { useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaX } from "react-icons/fa6";
import { HiDownload, HiReply } from "react-icons/hi";
import { IoIosMore } from "react-icons/io";
import { LuExternalLink, LuLink } from "react-icons/lu";
import useSlideAction from "@/hooks/use-slide-action";
import { generateCDN_URL } from "@/utils/generalFunctions";
import { formatDateForTooltip } from "@/utils/chatFunctions";
import AttachmentPreviewItem from "./ui/attachment-preview-item";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import type { Attachment, IUser } from "@/types/schema";
import { createDialog } from "../../create-dialog";
import { BsRobot } from "react-icons/bs";

function Button({
  children,
  content,
  caseText,
  clickHander,
}: {
  children: React.ReactNode;
  content: string;
  caseText: "forward" | "openInBrowser" | "saveVideo";
  clickHander: (caseText: "forward" | "openInBrowser" | "saveVideo") => void;
}) {
  return (
    <Tooltip
      showArrow
      contentProps={{
        padding: "8px",
        rounded: "lg",
        css: {
          "--tooltip-bg": "colors.gray.900",
          color: "white",
        },
      }}
      content={content}
    >
      <Flex
        onClick={() => clickHander(caseText)}
        boxSize="33px"
        alignItems="center"
        justifyContent="center"
        transition="0.5s ease"
        bg="transparent"
        borderColor="gray.600"
        border="1px solid transparent"
        _hover={{
          bg: "gray.700",
          borderColor: "gray.600",
        }}
        rounded="lg"
      >
        {children}
      </Flex>
    </Tooltip>
  );
}

type selectionType = "copyLink" | "copyAttachmentId" | "filename" | "size";

function AttachmentMenu({
  triggerId,
  more,
  copyLink,
  copyAttachmentId,
  id,
  viewDetails,
  attachmentFileName,
  attachmentSize,
  lang,
  handleOnMenuSelect,
}: {
  triggerId: string;
  more: string;
  copyLink: string;
  copyAttachmentId: string;
  id: string;
  viewDetails: {
    filename: string;
    size: string;
    text: string;
  };
  attachmentFileName: string;
  lang: string;
  attachmentSize: number;
  handleOnMenuSelect: (event: MenuSelectionDetails) => void;
}) {
  return (
    <Menu.Root
      onSelect={handleOnMenuSelect}
      size="md"
      ids={{ trigger: triggerId }}
    >
      <Tooltip
        showArrow
        contentProps={{
          padding: "8px",
          rounded: "lg",
          css: {
            "--tooltip-bg": "colors.gray.900",
            color: "white",
          },
        }}
        ids={{ trigger: triggerId }}
        content={more}
      >
        <Menu.Trigger asChild>
          <Flex
            boxSize="33px"
            alignItems="center"
            justifyContent="center"
            transition="0.5s ease"
            bg="transparent"
            borderColor="gray.600"
            border="1px solid transparent"
            _hover={{
              bg: "gray.700",
              borderColor: "gray.600",
            }}
            rounded="lg"
          >
            <IoIosMore size={19} />
          </Flex>
        </Menu.Trigger>
      </Tooltip>

      <Menu.Positioner>
        <Menu.Content
          maxW={{ base: "250px", lg: "250px" }}
          bg="gray.900"
          rounded="lg"
        >
          <Menu.Item
            _highlighted={{
              bg: "gray.800",
            }}
            color="white"
            display="flex"
            rounded="md"
            p="8px"
            justifyContent="space-between"
            value="copyLink"
          >
            {copyLink} <LuLink />
          </Menu.Item>

          <Menu.Item
            _highlighted={{
              bg: "gray.800",
            }}
            color="white"
            display="flex"
            rounded="md"
            p="8px"
            value="filename"
            flexDir="column"
            alignItems="flex-start"
            minW="full"
            gap="0px"
          >
            <Text
              maxW="100%"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {viewDetails.filename}
            </Text>

            <Text
              maxW="100%"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              color="fg.muted"
              fontSize="sm"
            >
              {attachmentFileName}
            </Text>
          </Menu.Item>

          <Menu.Item
            _highlighted={{
              bg: "gray.800",
            }}
            color="white"
            display="flex"
            rounded="md"
            p="8px"
            value="size"
            flexDir="column"
            alignItems="flex-start"
            minW="full"
            gap="0px"
          >
            <Text
              maxW="100%"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {viewDetails.size}
            </Text>

            <Text
              maxW="100%"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              color="fg.muted"
              fontSize="sm"
            >
              <LocaleProvider locale={lang}>
                <FormatByte value={attachmentSize} />
              </LocaleProvider>
            </Text>
          </Menu.Item>
          <Menu.Item
            _highlighted={{
              bg: "gray.800",
            }}
            color="white"
            rounded="lg"
            p="8px"
            value="copyAttachmentId"
            justifyContent="space-between"
          >
            {copyAttachmentId}{" "}
            <Badge size="xs" fontWeight="bold" color="gray.800" bg="white">
              {id}
            </Badge>
          </Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}

const AttachmentFullScreenUI = ({
  attachments,
  senderProfile,
  createdAt,
}: {
  attachments: Extract<Attachment, { type: "image" | "video" }>[];
  senderProfile?: IUser;
  createdAt: string;
}) => {
  const triggerId = useId();
  const { t: translate, i18n } = useTranslation(["chat"]);

  const {
    forward,
    more,
    openInBrowser,
    close,
    copyLink,
    copyAttachmentId,
    id,
    viewDetails,
    openFullScreen,
    saveVideo,
  } = translate("selectedVisualAttachmentsText") as unknown as {
    forward: string;
    openInBrowser: string;
    openFullScreen: string;
    more: string;
    close: string;
    copyLink: string;
    saveVideo: string;
    viewDetails: {
      filename: string;
      size: string;
      text: string;
    };
    copyAttachmentId: string;
    id: string;
  };
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentAttachment = attachments[currentIndex];
  const attachmentSize = currentAttachment.size;
  const attachmentFileName = currentAttachment.name;

  const handleNextAttachment = () => {
    if (attachments.length === 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % attachments.length);
  };

  const handlePrevAttachment = () => {
    if (attachments.length === 1) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? attachments.length - 1 : prevIndex - 1,
    );
  };

  useSlideAction({
    containerRef: containerRef,
    slideLeftFunction: handlePrevAttachment,
    slideRightFunction: handleNextAttachment,
  });

  const handleForward = () => {};
  const handleDownload = () => {
    if (!currentAttachment) return;

    if (!currentAttachment.filePath) return;
    const url = generateCDN_URL(
      currentAttachment.filePath,
      currentAttachment.mimeType,
      true,
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = currentAttachment.name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };
  const handleOpenInBrowser = () => {
    if (!currentAttachment) return;

    if (!currentAttachment.filePath) return;
    const url = generateCDN_URL(
      currentAttachment.filePath,
      currentAttachment.mimeType,
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = currentAttachment.name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };

  const clickHandler = (
    caseText: "forward" | "openInBrowser" | "saveVideo",
  ) => {
    switch (caseText) {
      case "forward":
        handleForward();
        break;
      case "openInBrowser":
        handleOpenInBrowser();
        break;
      case "saveVideo":
        handleDownload();
    }
  };

  const handleMenuSelect = (event: MenuSelectionDetails) => {
    const caseText = event.value as selectionType;

    switch (caseText) {
      case "copyLink":
      case "copyAttachmentId":
      case "filename":
      case "size":
    }
  };

  const handleExit = () => {
    const id = "showAttachmentId";
    createDialog.close(id);
  };

  if (!currentAttachment) return;

  return (
    <Flex ref={containerRef} pos="relative" zIndex={5} w="full" minH="full">
      <Flex
        zIndex={80}
        color="white"
        w="full"
        h="70px"
        alignItems="center"
        px="15px"
        pos="absolute"
        left="0"
        right="0"
        top="5"
        justifyContent="space-between"
      >
        {senderProfile && (
          <Flex gap="10px">
            <Avatar.Root>
              <Avatar.Fallback>
                <BsRobot />
              </Avatar.Fallback>
              <Avatar.Image src={senderProfile.profile?.profilePic} />
            </Avatar.Root>

            <Flex
              color="white"
              display={{ lg: "flex", base: "none" }}
              direction="column"
            >
              <Text>{senderProfile.displayName}</Text>
              <Text>{formatDateForTooltip(createdAt)}</Text>
            </Flex>
          </Flex>
        )}

        <Flex alignItems="center" gap="10px">
          <Flex
            border="1px solid"
            borderColor="gray.700"
            gap="2px"
            p="3px"
            rounded="xl"
            bg="gray.800"
          >
            <Button
              clickHander={clickHandler}
              caseText="forward"
              content={forward}
            >
              <HiReply
                style={{
                  transform: "scaleX(-1)",
                }}
                size={19}
              />
            </Button>

            {currentAttachment?.type === "video" && (
              <Button
                clickHander={clickHandler}
                caseText="saveVideo"
                content={saveVideo}
              >
                <HiDownload style={{ width: "20px", height: "20px" }} />
              </Button>
            )}

            <Button
              clickHander={clickHandler}
              caseText="openInBrowser"
              content={openInBrowser}
            >
              <LuExternalLink size={19} />
            </Button>

            <AttachmentMenu
              handleOnMenuSelect={handleMenuSelect}
              attachmentSize={attachmentSize}
              attachmentFileName={attachmentFileName}
              viewDetails={viewDetails}
              copyAttachmentId={copyAttachmentId}
              copyLink={copyLink}
              id={id}
              more={more}
              triggerId={triggerId}
              lang={i18n.language}
            />
          </Flex>

          <Tooltip
            showArrow
            contentProps={{
              padding: "8px",
              rounded: "lg",
              css: {
                "--tooltip-bg": "colors.gray.900",
                color: "white",
              },
            }}
            content={close}
          >
            <Flex
              onClick={handleExit}
              border="1px solid"
              borderColor="gray.700"
              boxSize="40px"
              alignItems="center"
              justifyContent="center"
              transition="0.5s ease"
              bg="gray.800"
              _hover={{
                bg: "gray.700",
                border: "1px solid",
                borderColor: "gray.500",
              }}
              rounded="xl"
            >
              <FaX />
            </Flex>
          </Tooltip>
        </Flex>
      </Flex>

      <Flex
        justifyContent="center"
        alignItems="center"
        minH="full"
        maxH="full"
        minW="full"
        maxW="full"
        pos="relative"
        onClick={handleExit}
      >
        {currentAttachment && (
          <AttachmentPreviewItem
            openFullScreenText={openFullScreen}
            attachment={currentAttachment}
          />
        )}

        {attachments.length > 1 && (
          <Flex
            display={{ base: "none", lg: "flex", md: "flex" }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handlePrevAttachment();
            }}
            pos="absolute"
            boxSize="40px"
            alignItems="center"
            justifyContent="center"
            transition="0.5s ease"
            bg="gray.900"
            borderColor="gray.600"
            border="1px solid transparent"
            _hover={{
              bg: "gray.800",
              borderColor: "gray.600",
            }}
            left="20px"
            rounded="lg"
            fontSize="22px"
            color="gray.300"
          >
            <GoArrowLeft />
          </Flex>
        )}

        {attachments.length > 1 && (
          <Flex
            display={{ base: "none", lg: "flex", md: "flex" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleNextAttachment();
            }}
            pos="absolute"
            boxSize="40px"
            alignItems="center"
            justifyContent="center"
            transition="0.5s ease"
            bg="gray.900"
            borderColor="gray.600"
            border="1px solid transparent"
            _hover={{
              bg: "gray.800",
              borderColor: "gray.600",
            }}
            rounded="lg"
            fontSize="22px"
            color="gray.300"
            right="20px"
          >
            <GoArrowRight />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default AttachmentFullScreenUI;
