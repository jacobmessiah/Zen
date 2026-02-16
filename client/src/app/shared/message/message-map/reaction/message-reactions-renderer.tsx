
import { Flex } from "@chakra-ui/react";

// P2P
const P2PMessageReactionsRenderer = ({ reactions }: { reactions: Record<string, { username: string; userId: string }[]> }) => {

  console.log(reactions)

  return <Flex></Flex>;
};

export { P2PMessageReactionsRenderer };
