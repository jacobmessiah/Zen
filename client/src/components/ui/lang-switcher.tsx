import { Button, Flex } from "@chakra-ui/react";
import { supportedLanguages } from "../../lib/array";
import { useTranslation } from "react-i18next";

const LanguageSwitches = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Flex w="50%" maxW="15%" gap="10px" pos="fixed" top="20%" left="5%" flexWrap="wrap">
      {supportedLanguages.map((lang) => (
        <Button
          onClick={() => changeLanguage(lang.code)}
          fontSize="xs"
          size="xs"
          key={lang.code}
        >
          {lang.lang}
        </Button>
      ))}
    </Flex>
  );
};

export default LanguageSwitches;
