import { Button, Flex, Popover, Portal } from "@chakra-ui/react";
import { memo, useState, type ReactNode } from "react";
import GifsUI from "./gifs-ui";
import { ChatEmojiContainer } from "./emoji-ui";

const EmojiAndGifUI = ({
  children,
  showTabOff = "gif",
  onEmojiSelect,
}: {
  children: ReactNode;
  showTabOff: string;
  onEmojiSelect: (value: string) => void;
}) => {
  const tabs = [
    { value: "emoji", text: "Emoji" },
    { value: "gif", text: "GIFs" },
  ];

  const [activeTab, setActiveTab] = useState<string>(showTabOff);

  return (
    <Popover.Root lazyMount unmountOnExit>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            w={{ base: "95dvw", lg: "35dvw", md: "35dvh" }}
            h="65dvh"
            mb="10px"
          >
            <Popover.Body w="full" h="full" p="0px">
              <Flex
                h={{ lg: "12%", base: "10%" }}
                alignItems="center"
                w="full"
                p="10px"
                gap="10px"
              >
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

              <Flex w="full" bg="none" h={{ base: "90%", lg: "88%" }}>
                {activeTab == "gif" && <GifsUI />}
                {activeTab === "emoji" && (
                  <ChatEmojiContainer onEmojiSelect={onEmojiSelect} />
                )}
              </Flex>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

export default memo(EmojiAndGifUI);
