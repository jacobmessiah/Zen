
import { getEmojiUrl } from "@/utils/chatFunctions";
import { Flex, Text } from "@chakra-ui/react";

// P2P
const P2PMessageReactionsRenderer = ({ reactions }: { reactions: Record<string, { username: string; userId: string }[]> }) => {
  return <Flex w="full"   >
    {Object.entries(reactions).map((reaction, index) => {
      return (
        <Flex
          h="33px"
          pr="5px"
          maxH="33px" minW="55px" maxW="65px"
          justifyContent="space-evenly"
          alignItems="center"
          bg="bg.emphasized"
          key={index} rounded="8px"
          _hover={{
            border: "1px solid",
            borderColor: { _light: "gray.300", _dark: "gray.600" }
          }}

        >
          <div style={{ backgroundImage: `url(${getEmojiUrl(reaction[0])})` }} className="reactionEmojiItem">
          </div>
          <Text>{reaction[1].length}</Text>
        </Flex>
      )

    })}

  </Flex>;
};

export { P2PMessageReactionsRenderer };
