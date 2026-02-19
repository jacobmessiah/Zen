import { Popover, Portal, Flex } from "@chakra-ui/react"
import { lazy, Suspense, useState } from "react";

// Lazy load the heavy emoji mapping component
const EmojiMappingUI = lazy(() => import("./emojis-mapping"));

const MessageEmojiReactionUI = ({ children, id, handleReaction }: { children: React.ReactNode, id: string, handleReaction: (emoji: string) => void }) => {

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const [isOpen, setIsOpen] = useState(false)

    const handleOnEmojiSelect = (emoji: string) => {
        void handleReaction(emoji)
        setIsOpen(false)
    }

    return (
        <Popover.Root
            unmountOnExit
            ids={{ trigger: id }}
            lazyMount
            positioning={{ placement: isMobile ? "bottom-start" : "left-end", strategy: "fixed" }}
            size="xs"
            modal
            onOpenChange={(e) => setIsOpen(e.open)}
            open={isOpen}
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
                        <Suspense fallback={
                            <Flex h="100%" w="100%" alignItems="center" justifyContent="center" color="fg.muted">
                                <Flex
                                    w="40px"
                                    h="40px"
                                    borderRadius="50%"
                                    border="3px solid"
                                    borderColor="bg.muted"
                                    borderTopColor="fg.default"
                                    animation="spin 1s linear infinite"
                                />
                            </Flex>
                        }>
                            <EmojiMappingUI onEmojiSelect={handleOnEmojiSelect} />
                        </Suspense>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    )
}

export default MessageEmojiReactionUI