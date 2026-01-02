import { Flex, IconButton, ScrollArea } from "@chakra-ui/react";
import { useState, type ChangeEvent } from "react";
import { IoSend } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";
import EmojiAndGifUI from "./emoji-gif";
import { FaFaceSmileWink } from "react-icons/fa6";
import type { MessageContent } from "../../types/schema";

export const MessageInputUI = ({
  inputPlaceHolder,
}: {
  inputPlaceHolder: string;
}) => {
  const MIN_HEIGHT = 45;

  const [inputValue, setInputValue] = useState("");

  const [attachedContent, setAttachedContent] = useState<MessageContent[]>([]);

  const handleOnchange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;

    if (value === "") {
      setInputValue("");
      event.target.style.height = `${MIN_HEIGHT}px`;
      return;
    }

    event.target.style.height = `${MIN_HEIGHT}px`;

    const newHeight = Math.min(event.target.scrollHeight);
    event.target.style.height = `${newHeight}px`;
    setInputValue(value);
  };

  const handleOnEmojiSelect = (emoji: string) => {
    if (!emoji) return;
    setInputValue((prev) => prev + emoji);
  };

  const handleSendMessage = () => {
    const messageContent: MessageContent[] = [];

    if (
      inputValue &&
      inputValue.length > 0 &&
      inputValue !== " " &&
      !/^\s*$/.test(inputValue)
    ) {
      const textOBJ: MessageContent = {
        type: "text",
        text: inputValue,
      };

      setInputValue("");
      messageContent.push(textOBJ);
    }

    if (attachedContent.length > 0) {
      attachedContent.forEach((attached) => {
        const attachOBJ = {
          ...attached,
        };
        messageContent.push(attachOBJ);
      });
      setAttachedContent([]);
    }
  };

  return (
    <Flex alignItems="flex-end" pb="10px" w="full" justifyContent="center">
      <Flex alignItems="center" gap="10px" w="98%">
        <IconButton height="40px" size="md" rounded="full" variant="ghost">
          <LuPlus />
        </IconButton>

        <ScrollArea.Root size="sm" maxH="300px" variant="always">
          <ScrollArea.Viewport
            rounded="lg"
            border="1px solid"
            borderColor="bg.emphasized"
          >
            <ScrollArea.Content
              w="full"
              alignItems="flex-start"
              gap="5px"
              display="flex"
              textStyle="sm"
            >
              <textarea
                style={{
                  height: `${MIN_HEIGHT}px`,
                  resize: "none",
                  width: "95%",
                  lineHeight: "1.5",
                  padding: "11px 10px",
                  background: "none",
                  fontSize: "15px",
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="no-focus"
                value={inputValue}
                onChange={handleOnchange}
                placeholder={inputPlaceHolder}
              />

              <Flex pr="10px" mt="8px" gap="5px">
                <EmojiAndGifUI
                  onEmojiSelect={handleOnEmojiSelect}
                  showTabOff="emoji"
                >
                  <Flex
                    w="30px"
                    h="30px"
                    rounded="lg"
                    justifyContent="center"
                    alignItems="center"
                    _hover={{
                      bg: "bg.emphasized",
                    }}
                  >
                    <FaFaceSmileWink size={20} />
                  </Flex>
                </EmojiAndGifUI>

                <Flex
                  w="30px"
                  h="30px"
                  display={{ base: "flex", lg: "none", md: "flex" }}
                  rounded="lg"
                  justifyContent="center"
                  alignItems="center"
                  _hover={{
                    bg: "bg.emphasized",
                  }}
                >
                  <IoSend size={20} />
                </Flex>
              </Flex>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar />
        </ScrollArea.Root>
      </Flex>
    </Flex>
  );
};
