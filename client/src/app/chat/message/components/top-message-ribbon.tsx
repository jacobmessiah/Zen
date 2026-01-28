import { Avatar, Flex, IconButton, Text } from "@chakra-ui/react";
import type { IUser } from "../../../../types/schema";
import { FiChevronLeft, FiVideo } from "react-icons/fi";
import { IoCallOutline } from "react-icons/io5";
import userChatStore from "@/store/user-chat-store";


const MessageTopRibbon = ({ otherUser }: { otherUser: IUser }) => {
  if (!otherUser) return null;

  return (
    <Flex
      alignItems="center"
      minW="full"
      maxW="full"
      justifyContent="center"
      h="70px"
      px="15px"
    >
      <Flex
        p="10px"
        h="50px"
        w="100%"
        rounded="full"
        border="1px solid"
        borderColor="fg.inverted"
        alignItems="center"
        justifyContent="space-between"
        bg="bg.muted"
        boxShadow="sm"
      >
        <Flex gap="2" alignItems="center">
          <IconButton
            onClick={() =>
              userChatStore.setState({
                displayedMessages: [],
                selectedConversation: null,
              })
            }
            rounded="full"
            boxShadow="inner"
            size="xs"
            variant="outline"
          >
            <FiChevronLeft />
          </IconButton>

          <Avatar.Root size="sm">
            <Avatar.Fallback name={otherUser?.displayName} />
            <Avatar.Image src={otherUser?.profile?.profilePic} />
          </Avatar.Root>

          <Text fontWeight="600" fontSize="md" userSelect="none">
            {otherUser.displayName}
          </Text>
        </Flex>

        <Flex gap="10px">
          <IconButton size="sm" variant="surface" rounded="full">
            <FiVideo />
          </IconButton>

          <IconButton size="sm" variant="surface" rounded="full">
            <IoCallOutline />
          </IconButton>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MessageTopRibbon;
