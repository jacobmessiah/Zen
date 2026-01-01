import { Flex, IconButton, ScrollArea } from "@chakra-ui/react";
import { useState, type ChangeEvent } from "react";
import { IoSend } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";
import { TbGif } from "react-icons/tb";
import EmojiAndGifUI from "./emoji-gif";

export const MessageInputUI = () => {
  const MIN_HEIGHT = 40;

  const [inputValue, setInputValue] = useState("");

  const handleOnchange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;

    if (value === "") {
      setInputValue("");
      event.target.style.height = `${MIN_HEIGHT}px`;
      return;
    }

    // reset height so scrollHeight is accurate
    event.target.style.height = `${MIN_HEIGHT}px`;

    // calculate new height
    const newHeight = Math.min(event.target.scrollHeight);
    event.target.style.height = `${newHeight}px`;
    setInputValue(value);
  };

  return (
    <Flex alignItems="flex-end" pb="10px" w="full" justifyContent="center">
      <Flex alignItems="flex-start" gap="10px" w="98%">
        <IconButton height="40px" size="md" rounded="full" variant="ghost">
          <LuPlus />
        </IconButton>

        <ScrollArea.Root  size="sm" maxH="300px" variant="always">
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
                  lineHeight: "1.4",
                  padding: "10px 10px",
                  background: "none"
                }}
                className="no-focus"
                value={inputValue}
                onChange={handleOnchange}
                placeholder="Bankia"
              />

              <Flex pr="10px" mt="5px" gap="5px">
                <EmojiAndGifUI>
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
                    <TbGif size={23} />
                  </Flex>
                </EmojiAndGifUI>

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
