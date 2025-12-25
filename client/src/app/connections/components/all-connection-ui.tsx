import { Flex, Input, InputGroup } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";

const AllConnectionsUI = () => {
  return (
    <Flex direction="column" minH="full" w="full" p="10px">
      <Flex w="full" p="10px" bg="red">
        <Flex
          minW={{ base: "95%", lg: "95%" }}
          maxW={{ base: "95%", lg: "95%" }}
          justifyContent="center"
          alignItems="center"
        >
          <InputGroup startElement={<FiSearch />}>
            <Input variant="subtle" w="full" maxLength={35} />
          </InputGroup>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AllConnectionsUI;
