import { Avatar, Circle, Flex, Float, Text } from "@chakra-ui/react";
import type { IConversation } from "../../../types/schema";

const ConversationItem = ({
  convoItem,
  isSelected,
}: {
  convoItem: IConversation;
  isSelected: boolean;
}) => {
  const otherUser = convoItem.otherUser;

  return (
    <Flex
      rounded="lg"
      _hover={{
        bg: "bg.emphasized",
      }}
      bg={isSelected ? "bg.emphasized" : ""}
      p="10px"
      transition="all"
      w="full"
      userSelect="none"
    >
      <Flex gap="10px" alignItems="center">
        <Avatar.Root size="md" colorPalette="bg" variant="subtle">
          <Avatar.Fallback />
          <Float placement="bottom-end" offsetX="1.5" offsetY="2">
            <Circle
              bg="green.500"
              size="8px"
              outline="0.2em solid"
              outlineColor="bg"
            />
          </Float>
        </Avatar.Root>

        <Text fontWeight="600">{otherUser.displayName}</Text>
      </Flex>
    </Flex>
  );
};

export default ConversationItem;
