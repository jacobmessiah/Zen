import emojiArray, { type EmojiCategory } from "@/lib/emojiArray";
import { getEmojiUrl } from "@/utils/chatFunctions";

import { Flex, Grid, Image, Input, InputGroup, Text } from "@chakra-ui/react";
import { useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";
import { RiEmotionSadLine } from "react-icons/ri";

const scrollYCss = {
  scrollBehavior: "smooth",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "fg.muted",
    borderRadius: "full",
  },
};

const EmojiCategoryItem = ({
  emojiCategory,
  categoryText,
  onSelect,
}: {
  emojiCategory: EmojiCategory;
  categoryText: string;
  onSelect: (emoji: string) => void;
}) => {
  return (
    <Flex direction="column" px="8px" w="full">
      <Text>{categoryText}</Text>

      <Grid
        w="full"
        templateColumns={{ base: "repeat(7, 1fr)", lg: "repeat(8, 1fr)" }}
        gap="3px"
        alignItems="center"
      >
        {emojiCategory.emojis.map((emoji) => (
          <button
            onClick={() => onSelect(emoji.value)}
            className="emojiItem"
            style={{
              backgroundImage: `url(${getEmojiUrl(emoji.value)})`,
            }}
          />
        ))}
      </Grid>
    </Flex>
  );
};

const EmojiMappingUI = ({
  showSearchBar = true,
  onEmojiSelect,
}: {
  showSearchBar?: boolean;
  onEmojiSelect: (emoji: string) => void;
}) => {
  const [emojisToMap, setEmojisToMap] = useState<EmojiCategory[]>(emojiArray);

  const { t: translate } = useTranslation(["chat"]);

  const { inputPlaceHolderText, noSearchResults } = translate(
    "EmojiMappingUI",
  ) as unknown as {
    inputPlaceHolderText: string;
    noSearchResults: string;
  };

  const searchEmoji = (query: string) => {
    const normalizedQuery = query.toLowerCase().trim();

    const searchResults = emojiArray
      .map((category) => {
        const matchedEmojis = category.emojis.filter((emoji) => {
          // Search by shortCode
          const shortCodeMatch = emoji.shortCode.toLowerCase().includes(normalizedQuery);

          // Search by emoji text (the actual emoji character)
          const textMatch = emoji.text.includes(query);

          // Search by category name
          const categoryMatch = category.value.toLowerCase().includes(normalizedQuery) ||
            category.categoryText.toLowerCase().includes(normalizedQuery);

          // Search by keywords from the emoji array
          const keywords = emoji.searchKeywords || [];
          const keywordMatch = keywords.some(keyword =>
            keyword.toLowerCase().includes(normalizedQuery)
          );

          // Search by removing colons from shortCode (for users who type without colons)
          const shortCodeNoColon = emoji.shortCode.replace(/:/g, '').toLowerCase();
          const shortCodeNoColonMatch = shortCodeNoColon.includes(normalizedQuery.replace(/:/g, ''));

          return shortCodeMatch || textMatch || categoryMatch || keywordMatch || shortCodeNoColonMatch;
        });

        if (matchedEmojis.length === 0) return null;

        return {
          ...category,
          emojis: matchedEmojis,
        };
      })
      .filter((category): category is EmojiCategory => category !== null);

    setEmojisToMap(searchResults);
  };

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const query = rawValue.trim();

    if (query.length === 0) {
      setEmojisToMap(emojiArray);
      return;
    }
    searchEmoji(query);
  };

  return (
    <Flex
      gap="10px"
      minH="full"
      minW="full"
      maxW="full"
      direction="column"
      maxH="full"
      userSelect="none"
    >
      {showSearchBar && (
        <Flex w="full" pt="2px" alignItems="center" px="10px">
          <InputGroup startElement={<FaSearch />}>
            <Input
              onChange={handleSearchInputChange}
              rounded="lg"
              placeholder={inputPlaceHolderText}
            />
          </InputGroup>
        </Flex>
      )}
      <Flex
        flex={1}
        borderTop="1px solid"
        borderTopColor="bg.emphasized"
        roundedBottom="10px"
        direction="column"
        gap="10px"
        overflow="auto"
        py="10px"
        css={scrollYCss}
      >
        {emojisToMap.length > 0 &&
          emojisToMap.map((category) => {
            return (
              <EmojiCategoryItem
                key={category.value}
                onSelect={onEmojiSelect}
                categoryText={translate(`EmojiMappingUI.${category.value}`)}
                emojiCategory={category}
              />
            );
          })}

        {emojisToMap.length === 0 && (
          <Flex
            justifyContent="center"
            alignItems="center"
            direction="column"
            flex={1}
            color="fg.muted"
          >
            <RiEmotionSadLine
              strokeWidth={0}
              style={{ width: "100px", height: "100px" }}
            />

            <Text>{noSearchResults}</Text>
          </Flex>
        )}
      </Flex>

      <Flex h="5px"></Flex>
    </Flex>
  );
};

export default EmojiMappingUI;
