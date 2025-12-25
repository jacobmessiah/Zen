import {
  Avatar,
  Circle,
  Flex,
  Float,
  IconButton,
  Text,
} from "@chakra-ui/react";
import type { connectionPingType, IUser } from "../../../types/schema";
import { LuX } from "react-icons/lu";

export const SentPendingConnectionItem = ({
  pendingItem,
}: {
  pendingItem: connectionPingType;
}) => {
  //Alert Set is Online with Logic
  const isOnline = true;

  const pingedUser = pendingItem.to as IUser;

  return (
    <Flex
      borderColor={{ _light: "gray.300", _dark: "gray.800" }}
      p="10px"
      w="full"
      justifyContent="space-between"
      alignItems="center"
      transition="0.2s ease"
      rounded="10px"
      border="1px solid"
    >
      <Flex gap="8px" alignItems="center">
        <Avatar.Root>
          <Avatar.Fallback name={pingedUser.displayName || "Z"} />
          <Avatar.Image src={pingedUser.profile?.profilePic} />
          {isOnline && (
            <Float placement="bottom-end" offsetX="1" offsetY="1">
              <Circle
                bg="green.500"
                size="8px"
                outline="0.2em solid"
                outlineColor="bg"
              />
            </Float>
          )}
        </Avatar.Root>

        <Flex direction="column">
          <Text fontSize="md" fontWeight="600">
            {pingedUser.displayName}
          </Text>
          <Text color={{ _light: "gray.500", _dark: "gray.300" }}>
            {pingedUser.username}
          </Text>
        </Flex>
      </Flex>

      <IconButton
        _hover={{
          colorPalette: "red",
        }}
        rounded="full"
        variant="ghost"
      >
        <LuX />
      </IconButton>
    </Flex>
  );
};
