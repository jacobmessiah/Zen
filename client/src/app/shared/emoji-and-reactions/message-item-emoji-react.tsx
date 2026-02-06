import { Popover, Portal } from "@chakra-ui/react";
import type { ReactNode } from "react";
import EmojiMappingUI from "./emojis-mapping";

const MessageItemEmojiReact = ({ children }: { children: ReactNode }) => {
  const handleOnEmojiSelect = (emoji: string) => {
    console.error(emoji);
  };

  return (
    <Popover.Root size="lg" positioning={{ placement: "bottom-end" }}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            pt="5px"
            h={{ base: "60dvh", lg: "70dvh", md: "70dvh" }}
            w={{ base: "98dvw", lg: "35dvw", md: "50dvw" }}
          >
            <EmojiMappingUI onEmojiSelect={handleOnEmojiSelect} />
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

export default MessageItemEmojiReact;
