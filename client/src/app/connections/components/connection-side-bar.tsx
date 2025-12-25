import { Button, Flex, Heading, Input, InputGroup } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import userConnectionStore from "../../../store/user-connections-store";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AllConnectionsUI from "./all-connection-ui";
import NewConnectionUI from "./new-connection-ui";

const ConnectionSideBar = () => {
  const { connections, onlineConnections, pendingConnections } =
    userConnectionStore();
  const { t: translate } = useTranslation(["connection"]);

  const [showConnectionsUiOff, setShowConnectionUiOff] = useState<
    "online" | "all" | "new" | "pending"
  >(connections.length > 0 ? "all" : "new");

  const connectionHeaderText = translate("ConnectionHeaderText");
  const searchConnectionPlaceholderText = translate(
    "SearchConnectionPlaceholderText"
  );

  const ConnectionAddButtonText = translate("ConnectionAddButtonText");

  return (
    <Flex
      w={{ base: "100%", lg: "40%" }}
      borderRight={{ base: "none", lg: "1px solid " }}
      borderColor={{ base: "none", lg: "colorPalette.muted" }}
      direction="column"
      alignItems="center"
    >
      <Flex
        userSelect="none"
        alignItems="center"
        justifyContent="space-between"
        w="full"
        px="10px"
        py="8px"
        borderBottom="1px solid"
        borderColor="colorPalette.muted"
      >
        <Heading fontWeight="600">{connectionHeaderText}</Heading>

        <Flex gap="10px" alignItems="center">
          {onlineConnections.length > 0 && (
            <Button variant="ghost" size={{ base: "md", lg: "sm" }}>
              Online
            </Button>
          )}
          {connections.length > 0 && (
            <Button variant="ghost" size={{ base: "md", lg: "sm" }}>
              All
            </Button>
          )}
          {pendingConnections.length > 0 && (
            <Button variant="ghost" size={{ base: "md", lg: "sm" }}>
              Pending
            </Button>
          )}

          <Button
            onClick={() => setShowConnectionUiOff("new")}
            size={{ base: "md", lg: "xs" }}
          >
            <LuPlus />
            {ConnectionAddButtonText}
          </Button>
        </Flex>
      </Flex>

      {showConnectionsUiOff !== "new" && (
        <Flex
          minW={{ base: "95%", lg: "95%" }}
          maxW={{ base: "95%", lg: "95%" }}
          justifyContent="center"
          alignItems="center"
        >
          <InputGroup>
            <Input
              variant="subtle"
              w="full"
              placeholder={searchConnectionPlaceholderText}
              maxLength={35}
            />
          </InputGroup>
        </Flex>
      )}

      {showConnectionsUiOff === "all" && <AllConnectionsUI />}
      {showConnectionsUiOff === "new" && <NewConnectionUI />}
    </Flex>
  );
};

export default ConnectionSideBar;
