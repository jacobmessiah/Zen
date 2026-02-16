import { Popover, Portal, } from "@chakra-ui/react"
import EmojiMappingUI from "./emojis-mapping";


const MessageEmojiReactionUI = ({ children, id, handleReaction }: { children: React.ReactNode, id: string, handleReaction: (emoji: string) => void }) => {


    const isMobile = window.matchMedia("(max-width: 768px)").matches;





    return (
        <Popover.Root
            unmountOnExit
            ids={{ trigger: id }}
            lazyMount
            positioning={{ placement: isMobile ? "bottom-start" : "left-end", strategy: "fixed" }}
            size="xs"
            modal
        >
            {children}

            <Portal>
                <Popover.Positioner>
                    <Popover.Content
                        padding="0px"
                        h={{ base: "60dvh", lg: "70dvh", md: "70dvh" }}
                        w={{ base: "98dvw", lg: "35dvw", md: "50dvw" }}
                        rounded="10px"
                        pt="10px"
                    >

                        <EmojiMappingUI onEmojiSelect={handleReaction} />
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    )
}

export default MessageEmojiReactionUI