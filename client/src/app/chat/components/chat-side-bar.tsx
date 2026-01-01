import { Flex, Heading, IconButton, Input, InputGroup } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import CreateDmUI from "./create-dm";

const ChatSideBar = () => {
  const { t: translate } = useTranslation(["chat"]);

  const chatTitle = translate("ChatTitle");
  const newChatText = translate("NewChat");
  const searchText = translate("SearchChats");
  const selectConnectionsTitle = translate("selectConnectionsTitle");
  const selectConnectionsDescription = translate(
    "selectConnectionsDescription"
  );

  const searchConnectionsPlaceHolder = translate(
    "searchConnectionsPlaceHolder"
  );

  return (
    <Flex
      borderRight={{ base: "none", lg: "1px solid ", md: "1px solid" }}
      borderColor={{
        base: "none",
        lg: "colorPalette.muted",
        md: "colorPalette.muted",
      }}
      w={{ base: "100%", lg: "30%", md: "45%" }}
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
        <Heading
          fontSize={{ base: "2xl", md: "xl", lg: "xl" }}
          fontWeight="600"
        >
          {chatTitle}
        </Heading>
        <CreateDmUI
          searchConnectionsPlaceHolder={searchConnectionsPlaceHolder}
          selectConnectionsTitle={selectConnectionsTitle}
          selectConnectionsDescription={selectConnectionsDescription}
          newChatText={newChatText}
        >
          <IconButton rounded="full" variant="ghost" size="xs">
            <LuPlus />
          </IconButton>
        </CreateDmUI>
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
