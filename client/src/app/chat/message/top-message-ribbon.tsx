import { Avatar, Flex, IconButton, Text } from "@chakra-ui/react";
import type { IUser } from "../../../types/schema";
import { FiVideo } from "react-icons/fi";
import { IoCallOutline } from "react-icons/io5";

const MessageTopRibbon = ({ otherUser }: { otherUser: IUser }) => {
  if (!otherUser) return null;

  return (
    <Flex
      alignItems="center"
      minW="full"
      maxW="full"
      justifyContent="center"
      h="70px"
    >
      <Flex
        p="10px"
        h="50px"
        w="95%"
        rounded="full"
        border="1px solid"
        borderColor="fg.inverted"
        alignItems="center"
        justifyContent="space-between"
        bg="bg.muted"
        boxShadow="sm"
      >
        <Flex gap="2" alignItems="center">
          <Avatar.Root size="sm">
            <Avatar.Fallback name={otherUser?.displayName} />
            <Avatar.Image src={otherUser?.profile?.profilePic} />
          </Avatar.Root>

          <Text fontWeight="600" fontSize="md" userSelect="none">
            {otherUser.displayName}
          </Text>
        </Flex>

        <Flex gap="5px">
          <IconButton variant="ghost" rounded="lg">
            <FiVideo />
          </IconButton>

          <IconButton variant="ghost" rounded="lg">
            <IoCallOutline />
          </IconButton>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MessageTopRibbon;
