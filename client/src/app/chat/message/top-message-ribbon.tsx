import { Avatar, Flex, IconButton, Text } from "@chakra-ui/react";
import type { IUser } from "../../../types/schema";
import { FiVideo } from "react-icons/fi";
import { IoCallOutline } from "react-icons/io5";

const MessageTopRibbon = ({ otherUser }: { otherUser: IUser }) => {
  if (!otherUser) return null;

  return (
    <Flex
      borderBottom="1px solid"
      borderColor={{
        base: "colorPalette.muted",
        lg: "colorPalette.muted",
        md: "colorPalette.muted",
      }}
      alignItems="center"
      minW="full"
      maxW="full"
      p="10px"
      h="70px"
      justifyContent="space-between"
    >
      <Flex gap="2" alignItems="center">
        <Avatar.Root>
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
  );
};

export default MessageTopRibbon;
