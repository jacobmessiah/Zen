import {
  Button,
  CloseButton,
  Flex,
  Float,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { BiSolidError } from "react-icons/bi";

const InvalidFileUI = ({
  removeDialog,
}: {
  removeDialog: (arg: "") => void;
}) => {
  const { t: translate } = useTranslation(["dialog"]);

  const INVALID_FILE_HEADER = translate("INVALID_FILE_HEADER");
  const INVALID_FILE_TEXT = translate("INVALID_FILE_TEXT");

  return (
    <Flex
      position="relative"
      onClick={(event) => event.stopPropagation()}
      bg="bg.emphasized"
      w={{ base: "80%", lg: "35%" }}
      h={{ base: "60%", lg: "55%" }}
      p="10px"
      direction="column"
      rounded="15px"
      alignItems="center"
      justifyContent="center"
      userSelect="none"
    >
      <Float offsetY="6" offsetX="6">
        <CloseButton
          onClick={() => removeDialog("")}
          rounded="lg"
          variant="outline"
        />
      </Float>

      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        h="80%"
        gap="2"
      >
        <Flex w="full" justifyContent="center">
          <BiSolidError size={120} />
        </Flex>

        <Heading textAlign="center" fontSize="xl">
          {INVALID_FILE_HEADER}
        </Heading>

        <Text fontSize="sm" textAlign="center">
          {INVALID_FILE_TEXT}
        </Text>
      </Flex>

      <Button
        onClick={() => removeDialog("")}
        w={{ base: "full", lg: "50%" }}
        rounded="lg"
        mt={{ base: "20px", md: "none", lg: "none" }}
        size={{ base: "sm" }}
      >
        I Understand
      </Button>
    </Flex>
  );
};

export default InvalidFileUI;
