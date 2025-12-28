import { Flex, Input, InputGroup, ScrollArea, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiSearch } from "react-icons/fi";
import type { ConnectionType } from "../../../types/schema";
import { ConnectionItem } from "./connection-item";

const AllConnectionsUI = ({
  connections,
}: {
  connections: ConnectionType[];
}) => {
  const { t: translate } = useTranslation(["connection"]);
  const searchConnectionPlaceholderText = translate(
    "SearchConnectionPlaceholderText"
  );

  const connectionLength = connections.length;

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
            <Flex
              gap="10px"
              px="10px"
              w="full"
              userSelect="none"
              direction="column"
            >
              <Text ml="2%" mt="5px" mb="5px" fontSize="md">
                All Connections - {connectionLength}
              </Text>

              {connections.map((connection) => (
                <ConnectionItem
                  connectionItem={connection}
                  key={connection._id}
                />
              ))}
            </Flex>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar />
      </ScrollArea.Root>
    </Flex>
  );
};

export default AllConnectionsUI;
