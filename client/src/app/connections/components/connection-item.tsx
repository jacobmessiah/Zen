import {
  Avatar,
  Circle,
  Flex,
  Float,
  IconButton,
  Menu,
  Portal,
  Text,
  type MenuSelectionDetails,
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
  handleRemoveConnection,
  ignoreConnectionPing,
} from "../../../utils/connectionsFunctions";
import { IoMdCheckmark } from "react-icons/io";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoChatbubbleSharp } from "react-icons/io5";
import { useId } from "react";

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
      animation={isDeleting ? "pulse" : ""}
      borderColor={{ _light: "gray.200", _dark: "gray.900" }}
      p="10px"
      w="full"
      justifyContent="space-between"
      alignItems="center"
      transition="0.2s ease"
      borderTop="1px solid"
      _hover={{
        bg: { _light: "gray.200", _dark: "gray.900" },
        rounded: "10px",
      }}
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
      borderColor={{ _light: "gray.200", _dark: "gray.900" }}
      p="10px"
      w="full"
      justifyContent="space-between"
      alignItems="center"
      transition="0.2s ease"
      borderTop="1px solid"
      _hover={{
        bg: { _light: "gray.200", _dark: "gray.900" },
        rounded: "10px",
      }}
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
  START_VIDEO_CALL_TEXT,
  START_VOICE_CALL_TEXT,
  SEND_MESSAGE_TEXT,
  REMOVE_CONNECTION_TEXT,
  MORE_TEXT,
}: {
  connectionItem: ConnectionType;
  START_VIDEO_CALL_TEXT: string;
  START_VOICE_CALL_TEXT: string;
  REMOVE_CONNECTION_TEXT: string;
  SEND_MESSAGE_TEXT: string;
  MORE_TEXT: string;
}) => {
  const otherUser = connectionItem.otherUser;

  const isOnline = true;

  const triggerId = useId();

  const handleOnSelect = (event: MenuSelectionDetails) => {
    switch (event.value) {
      case "remove:connection":
        handleRemoveConnection(connectionItem._id);
        break;
    }
  };

  return (
    <Flex
      borderColor={{ _light: "gray.200", _dark: "gray.900" }}
      p="10px"
      w="full"
      justifyContent="space-between"
      alignItems="center"
      transition="0.2s ease"
      borderTop="1px solid"
      _hover={{
        bg: { _light: "gray.200", _dark: "gray.900" },
        rounded: "10px",
      }}
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

      <Flex alignItems="center" gap="10px">
        <Tooltip
          showArrow
          positioning={{ placement: "top" }}
          content={SEND_MESSAGE_TEXT}
        >
          <IconButton variant="ghost" rounded="full">
            <IoChatbubbleSharp />
          </IconButton>
        </Tooltip>

        <Menu.Root
          onSelect={handleOnSelect}
          positioning={{ placement: "top" }}
          ids={{ trigger: triggerId }}
        >
          <Tooltip
            ids={{ trigger: triggerId }}
            positioning={{ placement: "top" }}
            content={MORE_TEXT}
            showArrow
          >
            <Menu.Trigger asChild>
              <IconButton variant="ghost" rounded="full">
                <HiOutlineDotsVertical />
              </IconButton>
            </Menu.Trigger>
          </Tooltip>
          <Portal>
            <Menu.Positioner>
              <Menu.Content rounded="lg">
                <Menu.Item rounded="sm" value="start:video">
                  {START_VIDEO_CALL_TEXT}
                </Menu.Item>
                <Menu.Item rounded="sm" value="start:audio">
                  {START_VOICE_CALL_TEXT}
                </Menu.Item>
                <Menu.Item
                  color="fg.error"
                  _hover={{ bg: "bg.error", color: "fg.error" }}
                  rounded="sm"
                  value="remove:connection"
                >
                  {REMOVE_CONNECTION_TEXT}
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>
    </Flex>
  );
};
