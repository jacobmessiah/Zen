import { Popover, Portal, } from "@chakra-ui/react"
import EmojiMappingUI from "./emojis-mapping";


const MessageEmojiReactionUI = ({ children, id }: { children: React.ReactNode, id: string }) => {


    const isMobile = window.matchMedia("(max-width: 768px)").matches;


    const onEmojiSelect = (emoji: string) => {
        console.log(emoji)
    }


    return (
        <Popover.Root
            unmountOnExit
            ids={{ trigger: id }}
            lazyMount
            positioning={{ placement: isMobile ? "bottom-start" : "left-end" }}
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

                        <EmojiMappingUI onEmojiSelect={onEmojiSelect} />
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    )
}

export default MessageEmojiReactionUI