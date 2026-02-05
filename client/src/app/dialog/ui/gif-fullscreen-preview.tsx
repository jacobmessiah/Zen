import { Tooltip } from "@/components/ui/tooltip";
import type { GifData } from "@/types";
import type { IUser } from "@/types/schema";
import { formatDateForTooltip } from "@/utils/chatFunctions";
import { Avatar, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaX } from "react-icons/fa6";
import { HiReply } from "react-icons/hi";
import { LuExternalLink } from "react-icons/lu";
import { PiLinkSimpleBold } from "react-icons/pi";
import { createDialog } from "../create-dialog";
import { useState } from "react";
import MediaLoadErrorUI from "@/app/shared/message/media-load-error-ui";

function Button({
  children,
  content,
  caseText,
  clickHander,
}: {
  children: React.ReactNode;
  content: string;
  caseText: "forward" | "openInBrowser" | "copyLink";
  clickHander: (caseText: "forward" | "openInBrowser" | "copyLink") => void;
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
        onClick={(e) => {
          e.stopPropagation();
          clickHander(caseText);
        }}
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

const GifFullScreenPreviewUI = ({
  senderProfile,
  gifData,
  createdAt,
}: {
  senderProfile: IUser | undefined;
  gifData: GifData;
  createdAt: string;
}) => {
  const handleExit = () => {
    const id = "showGifFullScreenId";
    createDialog.close(id);
  };

  const handleForward = () => {};
  const handleOpenInBrowser = () => {};

  const clickHandler = (caseText: "forward" | "openInBrowser" | "copyLink") => {
    switch (caseText) {
      case "forward":
        handleForward();
        break;
      case "openInBrowser":
        handleOpenInBrowser();
        break;
    }
  };

  const { t: translate } = useTranslation(["chat"]);

  const { forward, closeText, openInBrowser, copyLink } = translate(
    "gifPreview",
  ) as unknown as {
    forward: string;
    closeText: string;
    openInBrowser: string;
    copyLink: string;
  };

  const [videoDetails, setVideoDetails] = useState({
    isLoadError: false,
  });

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      pos="relative"
      zIndex={5}
      w="full"
      h="100vh"
    >
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
              <Avatar.Fallback name={senderProfile.displayName} />
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

            <Button
              clickHander={clickHandler}
              caseText="openInBrowser"
              content={openInBrowser}
            >
              <LuExternalLink size={19} />
            </Button>

            <Button
              clickHander={clickHandler}
              caseText="copyLink"
              content={copyLink}
            >
              <PiLinkSimpleBold />
            </Button>
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
            content={closeText}
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
        onClick={() => {
          handleExit();
        }}
        w="full"
        h="full"
      >
        <Flex
          onClick={(e) => e.stopPropagation()}
          p="0px"
          alignItems="center"
          justifyContent="center"
          w="100%"
          h="100%"
          maxW={{ base: "95%", lg: "45%" }}
          maxH={{ base: "500px" }}
        >
          {!videoDetails.isLoadError && (
            <video
              autoPlay
              muted
              loop
              onError={() => {
                setVideoDetails(() => ({ isLoadError: true }));
              }}
              src={gifData.preview}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "8px",
                pointerEvents: "none",
              }}
            />
          )}
          {videoDetails.isLoadError && <MediaLoadErrorUI />}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default GifFullScreenPreviewUI;
