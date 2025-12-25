import { Flex, Input, InputGroup, ScrollArea, Text } from "@chakra-ui/react";
import type { connectionPingType } from "../../../types/schema";
import { FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { SentPendingConnectionItem } from "./connection-item";

const PendingSentConnectionPingMapper = ({
  sentConnectionPings,
}: {
  sentConnectionPings: connectionPingType[];
}) => {
  if (Array.isArray(sentConnectionPings) && sentConnectionPings.length < 1)
    return null;

  const sentLength = sentConnectionPings.length;

  return (
    <Flex px="10px" w="full" minH="200vh" userSelect="none" direction="column">
      <Text ml="2%" mt="10px" mb="10px" fontSize="md">
        Sent Connections - {sentLength}
      </Text>

      {sentConnectionPings.map((item) => (
        <SentPendingConnectionItem key={item._id} pendingItem={item} />
      ))}
    </Flex>
  );
};

const PendingConnectionsUI = ({
  sentConnectionPings,
  receivedConnectionPings,
}: {
  sentConnectionPings: connectionPingType[];
  receivedConnectionPings: connectionPingType[];
}) => {
  const { t: translate } = useTranslation(["connection"]);
  const searchConnectionPlaceholderText = translate(
    "SearchConnectionPlaceholderText"
  );

  console.log(sentConnectionPings);
  console.log(receivedConnectionPings);
  return (
    <Flex
      gap="10px"
      pt="10px"
      direction="column"
      flex={1}
      alignItems="center"
      maxH="full"
      minH="full"
    >
      <Flex
        minW={{ base: "95%", lg: "95%" }}
        maxW={{ base: "95%", lg: "95%" }}
        justifyContent="center"
        alignItems="center"
      >
        <InputGroup startElement={<FiSearch />}>
          <Input
            variant="subtle"
            w="full"
            placeholder={searchConnectionPlaceholderText}
            maxLength={35}
          />
        </InputGroup>
      </Flex>

      <ScrollArea.Root>
        <ScrollArea.Viewport>
          <ScrollArea.Content paddingEnd="3" textStyle="sm">
            <PendingSentConnectionPingMapper
              sentConnectionPings={sentConnectionPings}
            />
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar />
      </ScrollArea.Root>
    </Flex>
  );
};

export default PendingConnectionsUI;
