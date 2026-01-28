import { Flex, Grid, Input, InputGroup, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";
import debounce from "lodash.debounce";
import { SearchGiphy } from "@/utils/chatFunctions";
import { type GifData } from "@/types";
import userChatStore from "@/store/user-chat-store";
import { gifCategories } from "@/lib/arrays";

const GifCategoryItem = ({
  name,
  value,
  preview,
}: {
  name: string;
  value: string;
  preview: string;
}) => {
  return (
    <Flex pos="relative" w="full" h="85px">
      <Flex h="full" pos="absolute" inset={0}>
        <Text>{name}</Text>
      </Flex>
      <video src={preview} style={{ height: "100%" }} />
    </Flex>
  );
};

const GifsUI = ({ showSearchBar = true }: { showSearchBar?: boolean }) => {
  const { t: translate } = useTranslation(["chat"]);

  const { inputPlaceHolderText } = translate("GifsUI") as unknown as {
    inputPlaceHolderText: string;
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [LoadedGifs, setLoadedGifs] = useState<GifData[]>([]);

  const debounceSearch = useCallback(
    debounce(async (query: string) => {
      const results = await SearchGiphy(query);

      if (results && Array.isArray(results)) {
        setLoadedGifs(results);
      } else {
        setLoadedGifs([]);
      }
    }, 800),
    [],
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchQuery(value.trim());
    if (!value || value.length === 0) {
      setLoadedGifs([]);
      return;
    }
    debounceSearch(value.trim());
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
        <Flex w="full" pt="2px" alignItems="center" px="10px">
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
      >
        {!searchQuery ||
          (searchQuery === " " && LoadedGifs.length === 0 && (
            <Grid templateColumns="repeat(2, 1fr)">
              {gifCategories.map((gifCategory) => {
                const { value, name } = translate(
                  `GifsUI.gifCategories.${gifCategory.value}`,
                ) as unknown as {
                  value: string;
                  name: string;
                };

                return (
                  <GifCategoryItem
                    name={name}
                    value={value}
                    preview={gifCategory.preview}
                  />
                );
              })}
            </Grid>
          ))}
      </Flex>
    </Flex>
  );
};

export default GifsUI;
