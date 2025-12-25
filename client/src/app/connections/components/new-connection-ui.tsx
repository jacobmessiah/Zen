import { Button, Flex, Input, InputGroup, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const NewConnectionUI = () => {
  const { t: translate } = useTranslation(["connection"]);

  const connectionAddInstructionText = translate("ConnectionAddInstruction");
  const newConnectionButtonText = translate("NewConnectionButtonText");
  const PingConnectionButtonText = translate("PingConnectionButtonText");

  return (
    <Flex direction="column" alignItems="center" w="full" gap="15px" p="10px">
      <Flex w="full" direction="column" userSelect="none">
        <Text fontWeight="semibold">{newConnectionButtonText}</Text>
        <Text fontSize="sm" color={{ _light: "gray.600" }}>
          {connectionAddInstructionText}
        </Text>
      </Flex>

      <InputGroup
        endElement={<Button size="sm">{PingConnectionButtonText}</Button>}
      >
        <Input size="xl" placeholder={connectionAddInstructionText} />
      </InputGroup>
    </Flex>
  );
};

export default NewConnectionUI;
