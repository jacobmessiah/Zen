import { Flex, Input, InputGroup, Text } from "@chakra-ui/react";
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

const EmojiCategoryUI = memo(
  ({
    emojiCategory,
    categoryText,
    onEmojiSelect,
  }: {
    emojiCategory: emojiCategoryType;
    categoryText: string;
    onEmojiSelect: (value: string) => void;
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
            gridTemplateColumns="repeat(9, 1fr)"
            gap="8px"
            w="full"
          >
            {emojiCategory.emojis.map((emoji, index) => {
              return (
                <Flex
                  onClick={() => onEmojiSelect(emoji.emoji)}
                  rounded="md"
                  _hover={{
                    bg: "bg.emphasized",
                  }}
                  py="10px"
                  key={index}
                  alignItems="center"
                  justifyContent="center"
                  w="full"
                >
                  <Text fontSize="3xl">{emoji.emoji}</Text>
                </Flex>
              );
            })}
          </Flex>
        )}
      </Flex>
    );
  },
);

const ChatEmojiContainer = ({
  onEmojiSelect,
}: {
  onEmojiSelect: (value: string) => void;
}) => {
  const { t: translate } = useTranslation(["chat"]);
  const searchEmojiPlaceHolder = translate("searchEmojiPlaceHolder");

  const [allEmojis, setAllEmojis] = useState<emojiCategoryType[]>(emojiArray);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (value === "") {
      setAllEmojis(emojiArray);
      return;
    }

    const lowerCaseQuery = value.toLowerCase();

    const newEmojiArray = emojiArray
      .map((category) => ({
        ...category,
        emojis: category.emojis.filter(
          (emoji) =>
            emoji.shortcode.toLowerCase().includes(lowerCaseQuery) ||
            emoji.emoji.includes(value) ||
            category.name.toLowerCase().includes(lowerCaseQuery),
        ),
      }))
      .filter((category) => category.emojis.length > 0);

    setAllEmojis(newEmojiArray);
  };

  return (
    <Flex pos="relative" w="full" h="full" direction="column">
      <Flex h="12%" alignItems="center" gap="8px" px="10px" w="full">
        <InputGroup startElement={<LuSearch />}>
          <Input
            onChange={handleInputChange}
            rounded="lg"
            placeholder={searchEmojiPlaceHolder}
          />
        </InputGroup>
      </Flex>

      <Flex
        maxH="88%"
        minH="88%"
        css={{
          "&::-webkit-scrollbar": {
            width: "5px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "bg.emphasized",
            borderRadius: "full",
          },
        }}
        direction="column"
        overflowY="auto"
      >
        {allEmojis.map((emojiCategory) => {
          const emojiCategoryText = translate(
            `emojiCategories.${emojiCategory.value}`,
          );
          return (
            <EmojiCategoryUI
              onEmojiSelect={onEmojiSelect}
              key={emojiCategory.value}
              categoryText={emojiCategoryText}
              emojiCategory={emojiCategory}
            />
          );
        })}
      </Flex>
    </Flex>
  );
};

export { ChatEmojiContainer };
