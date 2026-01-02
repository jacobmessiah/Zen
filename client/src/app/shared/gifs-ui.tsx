import { useTranslation } from "react-i18next";
import { LuSearch } from "react-icons/lu";
import { gifCategories } from "../../lib/arrays";
import { FaArrowLeftLong } from "react-icons/fa6";
import { searchTenor } from "../../utils/chatFunctions";
import userChatStore from "../../store/user-chat-store";
import debounce from "lodash.debounce";
import type { TenorResponseObject } from "../../types";
import {
  AbsoluteCenter,
  Box,
  Flex,
  Image,
  Input,
  InputGroup,
  Skeleton,
  Text,
} from "@chakra-ui/react";

import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";

type categoryProps = { text: string; queryKey: string; gifPreview: string };
const GifItem = ({
  gifItem,
  isLoaded,
  setLoadedGifs,
}: {
  gifItem: TenorResponseObject;
  isLoaded: boolean;
  setLoadedGifs: Dispatch<SetStateAction<string[]>>;
}) => {
  const source = gifItem.media_formats.mp4?.url;

  if (!source) return null;

  const [, height] = gifItem.media_formats.mp4?.dims;

  const resHeight = `${height}px`;

  return (
    <Box rounded="sm" w="full" height={resHeight} position="relative">
      {!isLoaded && <Skeleton w="full" h="full" position="absolute" />}
      <video
        src={source}
        onLoadedData={() =>
          setLoadedGifs((prev) => [...prev, gifItem.id.toString()])
        }
        style={{
          opacity: isLoaded ? "100%" : "0%",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "var(--chakra-radii-lg)",
        }}
        autoPlay
        loop
        muted
        playsInline
      />
    </Box>
  );
};

export const GIFSkeletons = ({ length }: { length: number }) => {
  return Array.from({ length }).map((_, index) => (
    <Skeleton key={index} w="full" h="200px" p="5px" />
  ));
};

const GIFCategoryItem = ({
  categoryItem,
  handleSelectCategory,
}: {
  categoryItem: categoryProps;
  handleSelectCategory: (queryKey: string, categoryText: string) => void;
}) => {
  return (
    <Flex
      onClick={() =>
        handleSelectCategory(categoryItem.queryKey, categoryItem.text)
      }
      userSelect="none"
      cursor="pointer"
      rounded="md"
      pos="relative"
      w="full"
    >
      <Image rounded="md" w="full" h="150px" src={categoryItem.gifPreview} />
      <Flex
        rounded="md"
        pos="absolute"
        inset={0}
        bg="#111111b4"
        _hover={{
          bg: "#111111e3",
        }}
        transition="0.2s ease"
        alignItems="center"
        justifyContent="center"
        color="white"
      >
        <Text fontSize="md">{categoryItem.text}</Text>
      </Flex>
    </Flex>
  );
};

const GifsUI = () => {
  const { t: translate } = useTranslation(["chat"]);

  const searchTenorPlaceHolderText = translate("searchTenorPlaceHolderText");
  const scrollRef = useRef<HTMLDivElement>(null);

  const resetScroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };

  const [queryKey, setQueryKey] = useState("");
  const [isError, setIsError] = useState({
    value: false,
    errMessage: "",
  });

  const [tenorResults, setTenorResults] = useState<TenorResponseObject[]>([]);
  const [loadedGifs, setLoadedGifs] = useState<string[]>([]);

  const { isSearchingTenor } = userChatStore();

  const debounceFunction = useCallback(
    debounce(async (value: string) => {
      if (value?.length < 1 || value === "" || typeof value !== "string")
        return;

      if (isSearchingTenor) return;
      setLoadedGifs([]);
      const response = await searchTenor(value);

      if (response.isError) {
        setIsError({
          value: true,
          errMessage: response.errMessage,
        });

        return;
      } else {
        setTenorResults(response.results);
      }
    }, 700),
    [],
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (value === "") {
      setQueryKey("");
      setTenorResults([]);
      setLoadedGifs([]);
      return;
    }

    setQueryKey(value);
    resetScroll();
    debounceFunction(value?.trim());
  };

  const handleClearAll = () => {
    setQueryKey("");
    setTenorResults([]);
    setLoadedGifs([]);
  };

  const handleSelectCategory = (queryKey: string, categoryText: string) => {
    setQueryKey(categoryText);
    debounceFunction(queryKey);
    resetScroll();
    setLoadedGifs([]);
  };

  return (
    <Flex w="full" h="full" direction="column">
      <Flex h="12%" alignItems="center" gap="8px" px="10px" w="full">
        {queryKey && <FaArrowLeftLong onClick={handleClearAll} size={23} />}
        <InputGroup startElement={<LuSearch />}>
          <Input
            onChange={handleInputChange}
            rounded="lg"
            placeholder={searchTenorPlaceHolderText}
            value={queryKey}
          />
        </InputGroup>
      </Flex>

      <Flex
        maxH="88%"
        minH="88%"
        rounded="15px"
        p="5px"
        gap="10px"
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
        direction="row"
        overflowY="auto"
      >
        {!queryKey && tenorResults.length < 1 && !isSearchingTenor && (
          <>
            <Flex direction="column" gap="10px" flex="1">
              {gifCategories
                .filter((_, index) => index % 2 === 0)
                .map((category, index) => (
                  <GIFCategoryItem
                    handleSelectCategory={handleSelectCategory}
                    key={index}
                    categoryItem={category}
                  />
                ))}
            </Flex>
            <Flex direction="column" gap="10px" flex="1">
              {gifCategories
                .filter((_, index) => index % 2 === 1)
                .map((category, index) => (
                  <GIFCategoryItem
                    handleSelectCategory={handleSelectCategory}
                    key={index}
                    categoryItem={category}
                  />
                ))}
            </Flex>
          </>
        )}

        {isError && tenorResults.length < 1 && queryKey.length > 0 && (
          <AbsoluteCenter w="full" h="full" pos="relative">
            <Text color="fg.muted">{isError?.errMessage}</Text>
          </AbsoluteCenter>
        )}

        {isSearchingTenor && tenorResults.length < 1 && queryKey.length > 0 && (
          <GIFSkeletons length={30} />
        )}

        {!isSearchingTenor && tenorResults.length > 0 && (
          <>
            <Flex direction="column" gap="10px" flex="1">
              {tenorResults
                .filter((_, index) => index % 2 === 0)
                .map((tenorItem) => {
                  const isLoaded = loadedGifs.includes(tenorItem.id.toString());
                  return (
                    <GifItem
                      setLoadedGifs={setLoadedGifs}
                      isLoaded={isLoaded}
                      key={tenorItem.id}
                      gifItem={tenorItem}
                    />
                  );
                })}
            </Flex>
            <Flex direction="column" gap="10px" flex="1">
              {tenorResults
                .filter((_, index) => index % 2 === 1)
                .map((tenorItem) => {
                  const isLoaded = loadedGifs.includes(tenorItem.id.toString());
                  return (
                    <GifItem
                      setLoadedGifs={setLoadedGifs}
                      isLoaded={isLoaded}
                      key={tenorItem.id}
                      gifItem={tenorItem}
                    />
                  );
                })}
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default GifsUI;
