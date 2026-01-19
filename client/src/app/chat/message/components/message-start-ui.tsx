import { Avatar, Flex, Heading, Text } from "@chakra-ui/react";
import type { IUser } from "../../../../types/schema";


const MessageStartUI = ({
  otherUser,
  beginingOfChatText,
}: {
  otherUser: IUser | undefined;
  beginingOfChatText: string;
}) => {
  if (!otherUser) return null;

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      w="full"
      p="10"
      direction="column"
      userSelect="none"
      gap="2"
    >
      <Avatar.Root width="20" h="20" size="2xl">
        <Avatar.Fallback />
        <Avatar.Image src={otherUser?.profile?.profilePic} />
      </Avatar.Root>

      <Heading fontSize="3xl">{otherUser.displayName}</Heading>

      <Heading fontWeight="400">{otherUser.username}</Heading>

      <Text textAlign="center">
        {beginingOfChatText} <Text as="strong">{otherUser.displayName}</Text>
      </Text>
    </Flex>
  );
};

export default MessageStartUI;
