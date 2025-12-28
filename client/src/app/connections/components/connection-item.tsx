import {
  Avatar,
  Circle,
  Flex,
  Float,
  IconButton,
  Text,
} from "@chakra-ui/react";
import type {
  connectionPingType,
  ConnectionType,
  IUser,
} from "../../../types/schema";
import { LuX } from "react-icons/lu";
import { Tooltip } from "../../../components/ui/tooltip";
import { useTranslation } from "react-i18next";
import {
  acceptConnectionPing,
  deleteSentConnectionPing,
  ignoreConnectionPing,
} from "../../../utils/connectionsFunctions";
import { IoMdCheckmark } from "react-icons/io";

export const SentPendingConnectionPingItem = ({
  pendingItem,
  isDeleting,
}: {
  pendingItem: connectionPingType;
  isDeleting: boolean;
}) => {
  //Alert Set is Online with Logic

  const isOnline = true;

  const pingedUser = pendingItem.to as IUser;

  const { t } = useTranslation(["connection"]);

  const CancelConnectionPingText = t("CancelConnectionPing");

  return (
    <Flex
      bg={{
        _light: isDeleting ? "gray.100" : "",
        _dark: isDeleting ? "gray.800" : "",
      }}
      animation={isDeleting ? "pulse" : ""}
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

      <Tooltip
        positioning={{ placement: "top" }}
        showArrow
        content={CancelConnectionPingText}
      >
        <IconButton
          _hover={{
            colorPalette: "red",
          }}
          rounded="full"
          variant="ghost"
          onClick={() => deleteSentConnectionPing(pendingItem._id, isDeleting)}
        >
          <LuX />
        </IconButton>
      </Tooltip>
    </Flex>
  );
};

export const ReceivedConnectionPingItem = ({
  pendingItem,
  isDeleting,
}: {
  pendingItem: connectionPingType;
  isDeleting: boolean;
}) => {
  //Alert Set is Online with Logic

  const isOnline = true;

  const pingFrom = pendingItem.from as IUser;

  const { t } = useTranslation(["connection"]);

  const ignoreConnectionText = t("ignoreConnectionText");

  const acceptConnectionText = t("acceptConnectionText");

  return (
    <Flex
      animation={isDeleting ? "pulse" : ""}
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
          <Avatar.Fallback name={pingFrom.displayName || "Z"} />
          <Avatar.Image src={pingFrom.profile?.profilePic} />
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
            {pingFrom.displayName}
          </Text>
          <Text color={{ _light: "gray.500", _dark: "gray.300" }}>
            {pingFrom.username}
          </Text>
        </Flex>
      </Flex>

      <Flex alignItems="center" gap="10px">
        <Tooltip
          positioning={{ placement: "top" }}
          showArrow
          content={ignoreConnectionText}
        >
          <IconButton
            onClick={() =>
              ignoreConnectionPing(pendingItem._id.toString(), isDeleting)
            }
            rounded="full"
            variant="ghost"
          >
            <LuX />
          </IconButton>
        </Tooltip>

        <Tooltip
          positioning={{ placement: "top" }}
          showArrow
          content={acceptConnectionText}
        >
          <IconButton
            onClick={() => acceptConnectionPing(pendingItem._id)}
            _hover={{
              colorPalette: "green",
            }}
            rounded="full"
            variant="ghost"
          >
            <IoMdCheckmark />
          </IconButton>
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export const ConnectionItem = ({
  connectionItem,
}: {
  connectionItem: ConnectionType;
}) => {
  const otherUser = connectionItem.otherUser;

  const isOnline = true;

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
          <Avatar.Fallback name={otherUser.displayName || "Z"} />
          <Avatar.Image src={otherUser.profile?.profilePic} />
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
            {otherUser.displayName}
          </Text>
          <Text color={{ _light: "gray.500", _dark: "gray.300" }}>
            {otherUser.username}
          </Text>
        </Flex>
      </Flex>

      <Flex alignItems="center" gap="10px"></Flex>
    </Flex>
  );
};
