import { Input, Popover, Portal, Text } from "@chakra-ui/react"


const MessageEmojiReactionUI = ({ children }: { children: React.ReactNode }) => {
    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                {children}
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content>
                        <Popover.Arrow />
                        <Popover.Body>
                            <Popover.Title fontWeight="medium">Naruto Form</Popover.Title>
                            <Text my="4">
                                Naruto is a Japanese manga series written and illustrated by
                                Masashi Kishimoto.
                            </Text>
                            <Input placeholder="Your fav. character" size="sm" />
                        </Popover.Body>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    )
}

export default MessageEmojiReactionUI