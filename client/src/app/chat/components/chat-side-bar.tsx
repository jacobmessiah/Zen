import { Flex, Heading, IconButton, Input, InputGroup } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { Tooltip } from "../../../components/ui/tooltip";
import { useTranslation } from "react-i18next";

const ChatSideBar = () => {
  const { t: translate } = useTranslation(["chat"]);

  const chatTitle = translate("ChatTitle");
  const newChatText = translate("NewChat");
  const searchText = translate("SearchChats");

  return (
    <Flex
      borderRight={{ base: "none", lg: "1px solid " }}
      borderColor={{ base: "none", lg: "colorPalette.muted" }}
      w={{ base: "100%", lg: "30%" }}
      p="5px"
      direction="column"
      alignItems="center"
    >
      <Flex
        userSelect="none"
        alignItems="center"
        justifyContent="space-between"
        w="full"
        p="10px"
      >
        <Heading fontWeight="600">{chatTitle}</Heading>

        <Tooltip content={newChatText}>
          <IconButton rounded="full" variant="ghost" size="xs">
            <LuPlus />
          </IconButton>
        </Tooltip>
      </Flex>

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
            placeholder={searchText}
            size="sm"
            maxLength={35}
          />
        </InputGroup>
      </Flex>
    </Flex>
  );
};
export default ChatSideBar;
