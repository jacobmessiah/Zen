import { Flex, Progress, Text } from "@chakra-ui/react";
import { FaFile } from "react-icons/fa6";

const UploadingFilesUI = ({ text }: { text: string }) => {
  return (
    <Flex
      minH="60px"
      minW="320px"
      maxW="320px"
      border="1px solid"
      borderColor="bg.emphasized"
      rounded="md"
      gap="2"
      userSelect="none"
      overflow="hidden"
    >
      <Flex
        color="fg.muted"
        h="full"
        minW="50px"
        alignItems="center"
        justifyContent="center "
      >
        <FaFile size={35} />
      </Flex>

      <Flex
        pr="10px"
        gap="1"
        justifyContent="center"
        flex={1}
        direction="column"
      >
        <Text
          maxW="200px" // maximum width
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {text}
        </Text>
        <Progress.Root variant="subtle" size="sm" rounded="full" value={null}>
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
      </Flex>
    </Flex>
  );
};

export default UploadingFilesUI;
