import { Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const AttachmentLimitUI = ({ max }: { max: number }) => {
  const { t: translate } = useTranslation(["dialog"]);

  const TOO_MANY_ATTACHMENTS_HEADER = translate("TOO_MANY_ATTACHMENTS_HEADER");
  const TOO_MANY_ATTACHMENTS_TEXT = translate("TOO_MANY_ATTACHMENTS_TEXT", {
    max: max.toString(),
  });

  return (
    <Flex direction="column" gap="2">
      <Text fontSize="lg" fontWeight="bold">
        {TOO_MANY_ATTACHMENTS_HEADER}
      </Text>
      <Text mb={6}>{TOO_MANY_ATTACHMENTS_TEXT}</Text>
    </Flex>
  );
};

export default AttachmentLimitUI;
