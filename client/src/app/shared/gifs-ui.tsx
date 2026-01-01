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
  Flex,
  Image,
  Input,
  InputGroup,
  ScrollArea,
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
  const source =
    gifItem.media_formats.gif ??
    gifItem.media_formats.mediumgif ??
    gifItem.media_formats.nanogif;

  if (!source) return;

  const [, height] = source.dims;

  return (
    <Flex rounded="sm" w="full" height={height}>
      {!isLoaded && <Skeleton w="full" h={`${height}px`} p="5px" />}
      <Image
        onLoad={() => setLoadedGifs((prev) => [...prev, gifItem.id.toString()])}
        opacity={isLoaded ? "100%" : "0%"}
        rounded="sm"
        w="full"
        h="full"
        src={source.url}
      />
    </Flex>
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
    []
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
      <Flex h="15%" alignItems="center" gap="8px" px="10px" w="full">
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

      <ScrollArea.Root
        ref={scrollRef}
        size="xs"
        maxH={{ lg: "50dvh" }}
        pl="5px"
        py="5px"
        rounded="15px"
        variant="hover"
      >
        <ScrollArea.Viewport>
          <ScrollArea.Content
            display="grid"
            gridColumn={2}
            paddingEnd="3"
            textStyle="xs"
            gap="8px"
            gridTemplateColumns="repeat(2, 1fr)"
          >
            {!queryKey &&
              tenorResults.length < 1 &&
              !isSearchingTenor &&
              gifCategories.map((category, index) => (
                <GIFCategoryItem
                  handleSelectCategory={handleSelectCategory}
                  key={index}
                  categoryItem={category}
                />
              ))}

            {isError && tenorResults.length < 1 && (
              <AbsoluteCenter w="full" h="full" pos="relative">
                <Text color="fg.muted">{isError?.errMessage}</Text>
              </AbsoluteCenter>
            )}

            {isSearchingTenor &&
              tenorResults.length < 1 &&
              queryKey.length > 0 && <GIFSkeletons length={30} />}

            {!isSearchingTenor &&
              tenorResults.length > 1 &&
              tenorResults.map((tenorItem) => {
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
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar />
      </ScrollArea.Root>
    </Flex>
  );
};

export default GifsUI;
