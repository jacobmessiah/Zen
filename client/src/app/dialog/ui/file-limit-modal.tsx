import {
  Button,
  CloseButton,
  Flex,
  Float,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { TiCloudStorage } from "react-icons/ti";

const FileLimitUI = ({ removeDialog }: { removeDialog: (arg: "") => void }) => {
  const { t: translate } = useTranslation(["dialog"]);

  const FILE_LIMIT_HEADER = translate("FILE_LIMIT_HEADER");
  const FILE_LIMIT_TEXT = translate("FILE_LIMIT_TEXT");
  return (
    <Flex
      onClick={(event) => event.stopPropagation()}
      position="relative"
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
          <TiCloudStorage size={150} />
        </Flex>

        <Heading textAlign="center" fontSize="xl">
          {FILE_LIMIT_HEADER}
        </Heading>

        <Text textAlign="center">{FILE_LIMIT_TEXT}</Text>
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

export default FileLimitUI;
