import { getEmojiUrl } from "@/utils/chatFunctions";
import { Box } from "@chakra-ui/react";
import { memo } from "react";

const MessageTextRenderer = ({ text }: { text: string }) => {
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
      fontSize="15px"
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

export default memo(MessageTextRenderer);
