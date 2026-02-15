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
            className="emojiItem"
            style={{
              backgroundImage: `url(${getEmojiUrl(emoji.value)})`,
            }}
            onClick={() => onSelect(emoji.value)}
            title={`${emoji.shortCode} - ${emoji.text}`}
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
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { t: translate } = useTranslation(["chat"]);

  const { noSearchResults } = translate(
    "EmojiMappingUI",
  ) as unknown as {
    noSearchResults: string;
  };

  // Enhanced emoji keyword mappings for better search
  const emojiKeywords: Record<string, string[]> = {
    "😀": ["happy", "smile", "grinning", "face"],
    "😃": ["happy", "smile", "smiley", "face"],
    "😄": ["happy", "smile", "grin", "face"],
    "😁": ["happy", "grin", "face", "teeth"],
    "😂": ["laugh", "tears", "joy", "funny"],
    "🤣": ["laugh", "rofl", "rolling", "funny"],
    "😍": ["love", "heart", "eyes", "adoration"],
    "🥰": ["love", "hearts", "happy", "affection"],
    "😎": ["cool", "sunglasses", "swag", "confident"],
    "🤔": ["thinking", "ponder", "wonder", "curious"],
    "😭": ["cry", "tears", "sad", "upset"],
    "😡": ["angry", "mad", "rage", "furious"],
    "👍": ["thumbs", "up", "good", "yes", "like"],
    "👎": ["thumbs", "down", "bad", "no", "dislike"],
    "🙌": ["hands", "up", "celebrate", "praise"],
    "🙏": ["pray", "please", "hope", "thanks"],
    "🔥": ["fire", "hot", "flame", "burning"],
    "❤️": ["heart", "love", "red", "romance"],
    "⭐": ["star", "favorite", "rating", "gold"],
    "✨": ["sparkle", "shine", "magic", "glitter"],
    "🎉": ["party", "celebrate", "confetti", "fun"],
    "💯": ["100", "perfect", "score", "hundred"],
    "🚀": ["rocket", "space", "launch", "fast"],
    "💡": ["idea", "lightbulb", "bright", "concept"],
    "🌈": ["rainbow", "colorful", "pride", "colors"],
    "🍕": ["pizza", "food", "italian", "slice"],
    "☕": ["coffee", "caffeine", "drink", "morning"],
    "🎮": ["game", "gaming", "play", "controller"],
    "🎵": ["music", "note", "song", "sound"],
    "⚽": ["soccer", "football", "sports", "ball"],
    "🌞": ["sun", "sunny", "weather", "bright"],
    "🌙": ["moon", "night", "sleep", "dark"],
    "⚡": ["lightning", "electric", "fast", "power"],
    "🎯": ["target", "goal", "aim", "focus"],
    "🏆": ["trophy", "winner", "champion", "award"],
    "💪": ["muscle", "strong", "fitness", "power"],
    "🤝": ["handshake", "agreement", "deal", "partnership"],
    "💰": ["money", "cash", "dollar", "rich"],
    "🎁": ["gift", "present", "birthday", "surprise"],
    "🌟": ["star", "glowing", "bright", "shining"],
    "🔑": ["key", "lock", "access", "secret"],
    "📱": ["phone", "mobile", "device", "smartphone"],
    "💻": ["computer", "laptop", "tech", "work"],
    "🌍": ["earth", "world", "globe", "planet"],
    "✈️": ["airplane", "travel", "fly", "vacation"],
    "🏠": ["house", "home", "building", "family"],
    "🌸": ["flower", "cherry", "blossom", "spring"],
    "🎨": ["art", "paint", "creative", "design"],
    "📚": ["books", "read", "study", "library"],
    "🍔": ["burger", "hamburger", "food", "fast food"],
    "🎪": ["circus", "tent", "show", "entertainment"],
    "🚗": ["car", "auto", "drive", "vehicle"],
    "⚠️": ["warning", "danger", "alert", "caution"],
    "♻️": ["recycle", "green", "environment", "reuse"],
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
          
          // Search by keywords
          const keywords = emojiKeywords[emoji.text] || [];
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

  // Common search suggestions
  const commonSearches = [
    "happy", "love", "sad", "angry", "cool", "food", "animal", 
    "sports", "music", "party", "travel", "work", "nature", "heart"
  ];

  const updateSearchSuggestions = (query: string) => {
    if (query.length === 0) {
      setSearchSuggestions(commonSearches);
      return;
    }
    
    const normalizedQuery = query.toLowerCase();
    const suggestions = commonSearches.filter(suggestion =>
      suggestion.toLowerCase().includes(normalizedQuery)
    );
    setSearchSuggestions(suggestions);
  };

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const query = rawValue.trim();

    updateSearchSuggestions(query);
    setShowSuggestions(query.length > 0);

    if (query.length === 0) {
      setEmojisToMap(emojiArray);
      return;
    }
    searchEmoji(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    searchEmoji(suggestion);
    setShowSuggestions(false);
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
        <Flex w="full" pt="2px" alignItems="center" px="10px" position="relative">
          <InputGroup startElement={<FaSearch />}>
            <Input
              onChange={handleSearchInputChange}
              rounded="lg"
              placeholder="Search emojis... (try: happy, love, food, sports)"
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
          </InputGroup>
          
          {showSuggestions && searchSuggestions.length > 0 && (
            <Flex
              position="absolute"
              top="100%"
              left="10px"
              right="10px"
              bg="bg.subtle"
              border="1px solid"
              borderColor="bg.emphasized"
              rounded="md"
              direction="column"
              maxH="200px"
              overflow="auto"
              zIndex={1000}
              css={scrollYCss}
            >
              {searchSuggestions.map((suggestion, index) => (
                <Flex
                  key={index}
                  px="3"
                  py="2"
                  cursor="pointer"
                  _hover={{ bg: "bg.emphasized" }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  fontSize="sm"
                >
                  {suggestion}
                </Flex>
              ))}
            </Flex>
          )}
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
