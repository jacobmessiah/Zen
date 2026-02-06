import { Text } from "@chakra-ui/react";
import { memo } from "react";

const MessageTextRenderer = ({ text }: { text: string }) => {
  return (
    <Text
      wordBreak="break-word"
      fontWeight="400"
      fontSize="15px"
      lineHeight="1.5"
      whiteSpace="pre-wrap"
      overflowWrap="anywhere"
      color="gray.800"
      _dark={{
        color: "gray.100",
      }}
      letterSpacing="0.01em"
    >
      {text}
    </Text>
  );
};

export default memo(MessageTextRenderer);
