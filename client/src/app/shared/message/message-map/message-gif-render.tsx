import type { GifData } from "@/types";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import React, { memo, useRef, useState } from "react";
import MediaLoadErrorUI from "../media-load-error-ui";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import userChatStore from "@/store/user-chat-store";
import { Tooltip } from "@/components/ui/tooltip";
import {
  addGifToFavourite,
  removeGifFromFavourite,
} from "@/utils/chatFunctions";

const LONG_PRESS_MS = 450;

const MessageGifRender = ({
  gifData,
  disPlayGifFullScreen,
}: {
  gifData: GifData;
  disPlayGifFullScreen: () => void;
}) => {
  const { preview } = gifData;

  const [isError, setIsError] = useState(false);
  const [showFavouriteButton, setShowFavouriteButton] = useState(false);
  const [longPressTriggered, setLongPressTriggered] = useState(false);

  const longPressTimer = useRef<number | null>(null);

  const { t } = useTranslation(["chat"]);

  const isFaved = userChatStore((state) =>
    state.favouriteGifs.some((g) => g.id === gifData.id),
  );

  const handleFavouriteToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    isFaved ? removeGifFromFavourite(gifData.id) : addGifToFavourite(gifData);
  };

  /* ---------- POINTER EVENTS (desktop + mobile) ---------- */

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();

    longPressTimer.current = window.setTimeout(() => {
      setLongPressTriggered(true);
      setShowFavouriteButton(true);
    }, LONG_PRESS_MS);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (!longPressTriggered) {
      disPlayGifFullScreen();
    }

    setLongPressTriggered(false);
  };

  const handlePointerLeave = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setLongPressTriggered(false);
    setShowFavouriteButton(false);
  };

  return (
    <Flex
      tabIndex={0}
      userSelect="none"
      maxW={{ base: "95%", lg: "400px" }}
      w="100%"
      maxH="300px"
      direction="column"
      pos="relative"
      overflow="hidden"
      onMouseEnter={() => setShowFavouriteButton(true)}
      onMouseLeave={() => setShowFavouriteButton(false)}
    >
      {!isError ? (
        <>
          {/* Move pointer events to a wrapper around the video only */}
          <Flex
            pos="relative"
            h="95%"
            w="100%"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
          >
            <video
              onError={() => setIsError(true)}
              autoPlay
              loop
              muted
              playsInline
              src={preview}
              style={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
                borderRadius: "5px",
                pointerEvents: "none",
              }}
            />

            <Tooltip
              showArrow
              positioning={{ placement: "top" }}
              content={
                isFaved
                  ? t("removeGifFromFavouriteText")
                  : t("addGifToFavourites")
              }
            >
              <IconButton
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onPointerLeave={(e) => e.stopPropagation()}
                onClick={handleFavouriteToggle}
                pos="absolute"
                top={showFavouriteButton ? "10px" : "-40px"}
                left="10px"
                size="xs"
                transition="0.2s ease"
              >
                {isFaved ? (
                  <FaStar style={{ width: 20, height: 20 }} />
                ) : (
                  <FaRegStar style={{ width: 20, height: 20 }} />
                )}
              </IconButton>
            </Tooltip>
          </Flex>

          <Text color="fg.muted" fontSize="xs">
            GIF
          </Text>
        </>
      ) : (
        <MediaLoadErrorUI />
      )}
    </Flex>
  );
};

export default memo(MessageGifRender);
