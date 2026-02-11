import ShowFullTimeStampTooltip from "@/app/shared/message/show-full-createdAt-tooltip";
import type { IMessage, IUser } from "@/types/schema";
import { formatMessageTimestamp } from "@/utils/chatFunctions";
import { Avatar, Flex, Text } from "@chakra-ui/react";
import { BsRobot } from "react-icons/bs";

const MessageItemPreview = ({
  message,
  senderProfile,
}: {
  message: IMessage;
  senderProfile: IUser;
}) => {
  return (
    <Flex boxShadow="sm" px="5px" py="10px" rounded="sm" w="full">
      <Flex justifyContent="center" w="50px">
        <Avatar.Root>
          <Avatar.Fallback>
            <BsRobot size={20} />
          </Avatar.Fallback>
        </Avatar.Root>
      </Flex>

      <Flex direction="column">
        <Flex gap="5px" alignItems="center">
          <Text cursor="pointer" color="fg.muted" fontWeight="600">
            {senderProfile?.displayName || "Deleted User"}
          </Text>

          <ShowFullTimeStampTooltip createdAt={message.createdAt}>
            <Text
              color="gray.fg"
              fontWeight="normal"
              cursor="pointer"
              fontSize="xs"
            >
              {formatMessageTimestamp(message.createdAt)}
            </Text>
          </ShowFullTimeStampTooltip>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MessageItemPreview;
