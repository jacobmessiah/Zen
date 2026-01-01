import { Button, Flex, Popover, Portal, Tabs } from "@chakra-ui/react";
import { useState, type ReactNode } from "react";
import GifsUI from "./gifs-ui";
import { ChatEmojiContainer } from "./emoji-ui";

const EmojiAndGifUI = ({
  children,
  showTabOff = "gif",
}: {
  children: ReactNode;
  showTabOff: string;
}) => {
  const tabs = [
    { value: "emoji", text: "Emoji" },
    { value: "gif", text: "GIFs" },
  ];

  const [activeTab, setActiveTab] = useState<string>(showTabOff);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            w={{ base: "95dvw", lg: "35dvw", md: "35dvh" }}
            h="65dvh"
            mb="10px"
            rounded="15px"
          >
            <Popover.Body rounded="15px" p="0px">
              <Flex h="12%" alignItems="center" w="full" p="10px" gap="10px">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.value;

                  return (
                    <Button
                      onClick={() => setActiveTab(tab.value)}
                      variant={isActive ? "subtle" : "ghost"}
                      key={tab.value}
                      rounded="lg"
                      size="sm"
                    >
                      {tab.text}
                    </Button>
                  );
                })}
              </Flex>

              <Flex w="full" h="88%">
                {activeTab == "gif" && <GifsUI />}
                {activeTab === "emoji" && <ChatEmojiContainer />}
              </Flex>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

export default EmojiAndGifUI;
