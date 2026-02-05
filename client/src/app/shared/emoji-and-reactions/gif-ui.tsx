import { Flex, IconButton, Input, InputGroup, Text } from "@chakra-ui/react";
import { useCallback, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";
import debounce from "lodash.debounce";
import { SearchGiphy } from "@/utils/chatFunctions";
import { type GifData } from "@/types";
import { gifCategories } from "@/lib/arrays";
import { GrLinkPrevious } from "react-icons/gr";
import { RiEmotionSadLine } from "react-icons/ri";

const GifCategoryItem = ({
  name,
  value,
  preview,
  onCategoryClick,
}: {
  name: string;
  value: string;
  preview: string;
  onCategoryClick: ({ value, name }: { value: string; name: string }) => void;
}) => {
  return (
    <Flex rounded="4px" overflow="hidden" pos="relative" w="full" h="105px">
      <Flex
        onClick={() => onCategoryClick({ value, name })}
        userSelect="none"
        bg="blackAlpha.500"
        _hover={{
          bg: "blackAlpha.700",
        }}
        zIndex={20}
        transition="0.3s ease"
        color="white"
        h="full"
        pos="absolute"
        inset={0}
        fontWeight="bold"
        justifyContent="center"
        alignItems="center"
      >
        <Text>{name}</Text>
      </Flex>
      <video
        src={preview}
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </Flex>
  );
};

const GifItem = ({
  gifData,
  onGifSelect,
}: {
  gifData: GifData;
  onGifSelect: ({ gifData }: { gifData: GifData }) => void;
}) => {
  const { height, preview } = gifData;

  return (
    <Flex
      onClick={() => onGifSelect({ gifData: gifData })}
      boxShadow="xs"
      w="full"
      h={height}
      className="isLoading"
    >
      <video
        autoPlay
        loop
        src={preview}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "5px",
        }}
      />
    </Flex>
  );
};

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

const GifsUI = ({
  showSearchBar = true,
  onGifSelect,
}: {
  showSearchBar?: boolean;
  onGifSelect: ({ gifData }: { gifData: GifData }) => void;
}) => {
  const { t: translate } = useTranslation(["chat"]);

  const { inputPlaceHolderText, noGifFound, gifSearchError } = translate(
    "GifsUI",
  ) as unknown as {
    inputPlaceHolderText: string;
    gifSearchError: string;
    noGifFound: string;
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [LoadedGifs, setLoadedGifs] = useState<GifData[]>([]);
  const [gifError, setGifError] = useState(false);
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);

  const debounceSearch = useCallback(
    debounce(async (query: string) => {
      setIsLoadingGifs(true);
      const results = await SearchGiphy(query);
      setIsLoadingGifs(false);

      if (results.isError) {
        // Show error UI: "Something went wrong"
        setIsLoadingGifs(false);
        setLoadedGifs([]);
        setGifError(true); // Add this state
      } else if (results.gifData.length === 0) {
        // Show "No GIFs found"
        setIsLoadingGifs(false);
        setLoadedGifs([]);
        setGifError(false);
      } else {
        setIsLoadingGifs(false);
        setLoadedGifs(results.gifData);
        setGifError(false);
      }
    }, 800),
    [],
  );

  const handleCategoryClick = async ({
    value,
    name,
  }: {
    value: string;
    name: string;
  }) => {
    setSearchQuery(name);
    setIsLoadingGifs(true);
    const results = await SearchGiphy(value);
    setIsLoadingGifs(false);

    if (results.isError) {
      setLoadedGifs([]);
      setGifError(true);
    } else {
      setLoadedGifs(results.gifData); // Could be empty array
      setGifError(false);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchQuery(value);
    if (!value || value.length === 0) {
      setLoadedGifs([]);
      return;
    }
    setIsLoadingGifs(true);
    debounceSearch(value);
  };

  const handleRemoveSearch = () => {
    setSearchQuery("");
    setLoadedGifs([]);
  };

  return (
    <Flex
      gap="10px"
      minH="full"
      minW="full"
      maxW="full"
      direction="column"
      maxH="full"
    >
      {showSearchBar && (
        <Flex w="full" pt="2px" gap="8px" alignItems="center" px="10px">
          {searchQuery && searchQuery.length > 0 && (
            <IconButton onClick={handleRemoveSearch} size="xs" variant="plain">
              <GrLinkPrevious style={{ width: "20px", height: "20px" }} />
            </IconButton>
          )}
          <InputGroup startElement={<FaSearch />}>
            <Input
              value={searchQuery}
              onChange={handleInputChange}
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
        css={scrollYCss}
        overflow="auto"
        px="10px"
        py="10px"
        direction="column"
        bg="none"
      >
        {/*Category Mapping */}
        {!isLoadingGifs && !searchQuery && (
          <Flex
            flex={1}
            roundedBottom="10px"
            direction="column"
            gap="10px"
            gridTemplateColumns="repeat(2, 1fr)"
            display="grid"
            bg="none"
          >
            {gifCategories.map((gifCategory) => {
              const { value, name } = translate(
                `GifsUI.gifCategories.${gifCategory.value}`,
              ) as unknown as {
                value: string;
                name: string;
              };

              return (
                <GifCategoryItem
                  onCategoryClick={handleCategoryClick}
                  key={value}
                  name={name}
                  value={value}
                  preview={gifCategory.preview}
                />
              );
            })}
          </Flex>
        )}

        {!isLoadingGifs &&
          searchQuery &&
          LoadedGifs &&
          LoadedGifs.length > 0 && (
            <div className="gifGallery">
              {LoadedGifs.map((gifItem) => {
                return (
                  <GifItem
                    onGifSelect={onGifSelect}
                    key={gifItem.id}
                    gifData={gifItem}
                  />
                );
              })}
            </div>
          )}

        {!isLoadingGifs &&
          searchQuery &&
          searchQuery.length > 0 &&
          LoadedGifs.length === 0 && (
            <Flex
              flex={1}
              justifyContent="center"
              alignItems="center"
              direction="column"
              color="fg.muted"
            >
              <RiEmotionSadLine
                strokeWidth={0}
                style={{ width: "100px", height: "100px" }}
              />

              <Text>{noGifFound}</Text>
            </Flex>
          )}

        {!isLoadingGifs &&
          searchQuery &&
          searchQuery.length > 0 &&
          LoadedGifs.length === 0 &&
          gifError && (
            <Flex
              flex={1}
              justifyContent="center"
              alignItems="center"
              direction="column"
              color="fg.muted"
            >
              <RiEmotionSadLine
                strokeWidth={0}
                style={{ width: "100px", height: "100px" }}
              />

              <Text>{gifSearchError}</Text>
            </Flex>
          )}

        {searchQuery && LoadedGifs.length === 0 && isLoadingGifs && (
          <div className="gifGallery">
            {Array.from({ length: 15 }).map((_, index) => (
              <div key={index} className="gif-skeleton" />
            ))}
          </div>
        )}
      </Flex>
      <Flex h="5px"></Flex>
    </Flex>
  );
};

export default GifsUI;
