import { Text } from "@chakra-ui/react";

const MessageTextRenderer = ({ text }: { text: string }) => {
  return <Text wordBreak="break-word" fontSize="md" whiteSpace="pre-wrap">{text}</Text>;
};

export default MessageTextRenderer;
