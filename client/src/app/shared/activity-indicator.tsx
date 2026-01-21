import { Box, Flex, Float, Text } from "@chakra-ui/react";
import userPresenseStore from "../../store/user-presense-store";
import { MdDoNotDisturbOn } from "react-icons/md";
import { IoMoonSharp } from "react-icons/io5";
import { FaCircle } from "react-icons/fa";
import { FiCircle } from "react-icons/fi";
import { BeatLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

export const OnlineIndicator = ({ userId }: { userId: string }) => {
  const presence = userPresenseStore((state) => state.onlinePresenses[userId]);

  const isOnline = !!presence;

  const getIndicatorStyles = () => {
    if (!isOnline) {
      return {
        background: "bg",
        color: "fg.muted",
      };
    }

    if (presence.availability === "dnd") {
      return {
        background: "bg",
        color: "red.500",
        borderColor: "bg.emphasized",
        borderWidth: "0px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1px",
      };
    }

    if (presence.availability === "idle") {
      return {
        background: "bg",
        color: "yellow.500",
        borderColor: "bg.emphasized",
        borderWidth: "0px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1px",
      };
    }

    // Online state
    return {
      background: "bg",
      color: "green.500",
      borderColor: "bg.emphasized",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1px",
    };
  };

  return (
    <Float placement="bottom-end" offset="2">
      <Box p="3px" rounded="full" background="bg">
        <Box
          rounded="full"
          transition="all 0.3s ease-in-out"
          {...getIndicatorStyles()}
        >
          {isOnline && presence.availability === "dnd" && (
            <MdDoNotDisturbOn size={11.5} />
          )}

          {isOnline && presence.availability === "idle" && (
            <IoMoonSharp size={11.5} />
          )}

          {isOnline && presence.availability === "online" && (
            <FaCircle size={11.5} />
          )}

          {!isOnline && <FiCircle strokeWidth={4.5} size={11.5} />}
        </Box>
      </Box>
    </Float>
  );
};

export const ConversationActivityIndicator = ({
  userId,
}: {
  userId: string;
}) => {
  const presence = userPresenseStore((state) => state.onlinePresenses[userId]);

  const isOnline = !!presence;

  const typing = userPresenseStore((state) => state.typingEvents[userId]);
  const isTyping = !!typing;

  const getIndicatorStyles = () => {
    if (isTyping) {
      return {};
    }

    if (!isOnline) {
      return {
        background: "bg",
        color: "fg.muted",
      };
    }

    if (presence.availability === "dnd") {
      return {
        background: "bg",
        color: "red.500",
        borderColor: "bg.emphasized",
        borderWidth: "0px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1px",
      };
    }

    if (presence.availability === "idle") {
      return {
        background: "bg",
        color: "yellow.500",
        borderColor: "bg.emphasized",
        borderWidth: "0px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1px",
      };
    }

    // Online state
    return {
      background: "bg",
      color: "green.500",
      borderColor: "bg.emphasized",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1px",
    };
  };

  // typing Indicator Colors -->
  // offline and idle bg = "fg.muted"
  // online bg = "green.600"
  // dnd bg = "red.500"

  return (
    <Float placement="bottom-end" offset="2">
      <Box
        p="3px"
        rounded="full"
        bg={
          isTyping
            ? !isOnline
              ? "fg.muted"
              : presence.availability === "dnd"
                ? "red.500"
                : presence.availability === "idle"
                  ? "fg.muted"
                  : "green.600"
            : "bg"
        }
      >
        <Box
          rounded="full"
          transition="all 0.3s ease-in-out"
          {...getIndicatorStyles()}
        >
          {isOnline && !isTyping && presence.availability === "dnd" && (
            <MdDoNotDisturbOn size={11.5} />
          )}

          {isOnline && !isTyping && presence.availability === "idle" && (
            <IoMoonSharp size={11.5} />
          )}

          {isOnline && !isTyping && presence.availability === "online" && (
            <FaCircle size={11.5} />
          )}

          {!isOnline && !isTyping && <FiCircle strokeWidth={4.5} size={11.5} />}

          {isTyping && (
            <BeatLoader
              color="white"
              margin={1}
              cssOverride={{
                padding: "0px",
                display: "flex",
              }}
              size={5}
            />
          )}
        </Box>
      </Box>
    </Float>
  );
};

export const P2PChatIndicator = ({
  userId,
  displayName,
}: {
  userId: string | undefined;
  displayName: string | undefined;
}) => {
  if (!userId) return;
  const typing = userPresenseStore((state) => state.typingEvents[userId]);
  const isTyping = !!typing;

  const { t } = useTranslation(["chat"]);

  const typingText = t("typingText", {
    name: displayName,
  });

  return (
    <Flex
      userSelect="none"
      pointerEvents="none"
      fontSize="13px"
      minW="full"
      maxW="full"
      rounded="md"
      gap="10px"
      minH="20px"
      background="transparent"
    >
      {isTyping && (
        <Flex
          w={{ lg: "7%" }}
          alignItems="center"
          justifyContent="center"
          minW="60px"
        >
          <BeatLoader size={8} />
        </Flex>
      )}

      {isTyping && <Text>{typingText}</Text>}
    </Flex>
  );
};
