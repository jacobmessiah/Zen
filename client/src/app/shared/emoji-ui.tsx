import {
  Flex,
  Image,
  Input,
  InputGroup,
  ScrollArea,
  Text,
} from "@chakra-ui/react";
import twemoji from "twemoji";
import { memo, useState, type ChangeEvent } from "react";
import { LuSearch } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { FaFaceSmile, FaLeaf, FaTruckPlane } from "react-icons/fa6";
import { IoFastFood, IoFlagSharp } from "react-icons/io5";
import { IoLogoGameControllerB } from "react-icons/io";
import { TbLamp2, TbMathSymbols } from "react-icons/tb";
import emojiArray from "../../lib/emojiArray";
import { GrNext } from "react-icons/gr";

type emoji = {
  unicode: string;
  emoji: string;
  shortcode: string;
};

type emojiCategoryType = {
  name: string;
  value: string;
  emojis: emoji[];
};

function returnCategoryIcon(value: string) {
  switch (value) {
    case "people":
      return <FaFaceSmile />;

    case "nature":
      return <FaLeaf />;

    case "food":
      return <IoFastFood />;

    case "activities":
      return <IoLogoGameControllerB />;

    case "travel":
      return <FaTruckPlane />;

    case "objects":
      return <TbLamp2 />;

    case "symbols":
      return <TbMathSymbols />;

    case "flags":
      return <IoFlagSharp />;
  }
}

function parseEmoji(value: string) {
  const codePoint = twemoji.convert.toCodePoint(value);
  const source = `https://twemoji.maxcdn.com/v/latest/svg/${codePoint}.svg`;
  return source;
}

const EmojiCategoryUI = memo(
  ({
    emojiCategory,
    categoryText,
  }: {
    emojiCategory: emojiCategoryType;
    categoryText: string;
  }) => {
    const [showChildrenEmojis, setShowChildrenEmojis] = useState(true);

    return (
      <Flex direction="column" gap="5px" userSelect="none" w="full" p="10px">
        <Flex
          onClick={() => setShowChildrenEmojis(!showChildrenEmojis)}
          fontSize="sm"
          gap="5px"
          alignItems="center"
        >
          {returnCategoryIcon(emojiCategory.value)}
          <Text>{categoryText}</Text>

          <Flex
            transition="0.1s ease"
            rotate={showChildrenEmojis ? "90deg" : "0deg"}
            alignItems="center"
            justifyContent="center"
          >
            <GrNext />
          </Flex>
        </Flex>

        {showChildrenEmojis && (
          <Flex
            display="grid"
            gridTemplateColumns="repeat(10, 1fr)"
            gap="8px"
            w="full"
          >
            {emojiCategory.emojis.map((emoji) => {
              const source = parseEmoji(emoji.emoji);
              return (
                <Image
                  rounded="md"
                  _hover={{
                    bg: "bg.emphasized",
                  }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                  }}
                  p="5px"
                  key={emoji.unicode}
                  alignItems="center"
                  justifyContent="center"
                  loading="lazy"
                  w="full"
                  src={source}
                />
              );
            })}
          </Flex>
        )}
      </Flex>
    );
  }
);

const ChatEmojiContainer = () => {
  const { t: translate } = useTranslation(["chat"]);
  const [searchEmojiPlaceHolder, setSearchEmojiPlaceHolder] = useState(
    translate("searchEmojiPlaceHolder")
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {};

  const [allEmojis, setAllEmojis] = useState<emojiCategoryType[]>(emojiArray);

  return (
    <Flex pos="relative" w="full" h="full" direction="column">
      <Flex h="15%" alignItems="center" gap="8px" px="10px" w="full">
        <InputGroup startElement={<LuSearch />}>
          <Input
            onChange={handleInputChange}
            rounded="lg"
            placeholder={searchEmojiPlaceHolder}
          />
        </InputGroup>
      </Flex>

      <ScrollArea.Root
        size="xs"
        maxH={{ lg: "50dvh" }}
        pl="5px"
        py="5px"
        roundedBottom="15px"
        variant="hover"
      >
        <ScrollArea.Viewport>
          <ScrollArea.Content
            display="flex"
            flexDirection="column"
            paddingEnd="3"
            textStyle="xs"
            gap="8px"
            gridTemplateColumns="repeat(2, 1fr)"
          >
            {allEmojis.map((emojiCategory) => {
              const emojiCategoryText = translate(
                `emojiCategories.${emojiCategory.value}`
              );
              return (
                <EmojiCategoryUI
                  categoryText={emojiCategoryText}
                  emojiCategory={emojiCategory}
                />
              );
            })}
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar />
      </ScrollArea.Root>
    </Flex>
  );
};

export { ChatEmojiContainer };
