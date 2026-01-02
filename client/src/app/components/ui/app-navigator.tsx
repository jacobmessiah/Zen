import { Flex, Float } from "@chakra-ui/react";
import { FiLayers, FiMessageCircle, FiZap } from "react-icons/fi";
import { HiOutlineShare } from "react-icons/hi";
import { Tooltip } from "../../../components/ui/tooltip";
import { useColorModeValue } from "../../../components/ui/color-mode";
import userCallStore from "../../../store/user-call-store";
import { useLocation, useNavigate } from "react-router-dom";
import userConnectionStore from "../../../store/user-connections-store";
import { GrSettingsOption } from "react-icons/gr";

const AppNavigatorBig = () => {
  const { isCalling } = userCallStore();

  const { receivedConnectionPings } = userConnectionStore();

  const sideBarLinksArray = [
    {
      text: "Chats",
      url: "chats",
      icon: <FiMessageCircle size={22} />,
    },
    {
      text: "Spaces",
      url: "spaces",
      icon: <FiLayers size={22} />,
    },

    {
      text: "Connections",
      url: "connections",
      icon: <HiOutlineShare size={22} />,
    },
    {
      text: "Moments",
      url: "moments",
      icon: <FiZap size={22} />,
    },
  ];

  const hoverBg = useColorModeValue("gray.200", "gray.700");
  const navigate = useNavigate();

  const location = useLocation();

  const handleNavigation = (url: string) => {
    if (isCalling) {
      ///NOTICE Show alert that user is in call
      return;
    } else {
      navigate(url);
    }
  };

  const hasIncomingRequests =
    Array.isArray(receivedConnectionPings) &&
    receivedConnectionPings.length > 0;

  const notifyHasConnectionEl = (
    <Float offset="1.5">
      <Flex
        ml="2"
        bg="red"
        color="white"
        p="5px"
        borderRadius="full"
        justifyContent="center"
        alignItems="center"
        fontSize="xs"
      ></Flex>
    </Float>
  );

  return (
    <Flex
      pt="10px"
      rounded="full"
      w="full"
      minH="full"
      alignItems="center"
      direction="column"
      gap="15px"
      transition="0.5s all ease-in-out"
    >
      {sideBarLinksArray.map((item) => {
        const isActive = location.pathname.includes(item.url);

        const isConnections = item.url === "connections";

        return (
          <Flex
            w="full"
            pos="relative"
            justifyContent="center"
            alignItems="center"
            key={item.url}
          >
            <Tooltip
              positioning={{
                placement: "right",
              }}
              content={item.text}
              showArrow
            >
              <Flex
                onClick={() => handleNavigation(item.url)}
                rounded="lg"
                w="40px"
                pos="relative"
                h="40px"
                bg={isActive ? hoverBg : ""}
                cursor="pointer"
                _hover={{
                  bg: hoverBg,
                }}
                justifyContent="center"
                alignItems="center"
              >
                {item.icon}

                {isConnections && hasIncomingRequests && notifyHasConnectionEl}
              </Flex>
            </Tooltip>

            <Flex
              minH={isActive ? "35px" : "15px"}
              p="2px"
              bg={{ _light: "black", _dark: "white" }}
              roundedTopRight="full"
              roundedBottomRight="full"
              pos="absolute"
              left="-2%"
              transition="0.2s all ease-in-out"
            />
          </Flex>
        );
      })}
    </Flex>
  );
};

export const AppNavigatorSmall = () => {
  const { isCalling } = userCallStore();

  const sideBarLinksArray = [
    {
      text: "Chats",
      url: "chats",
      icon: <FiMessageCircle size={25} />,
    },
    {
      text: "Spaces",
      url: "spaces",
      icon: <FiLayers size={25} />,
    },

    {
      text: "Connections",
      url: "connections",
      icon: <HiOutlineShare size={25} />,
    },
    {
      text: "Moments",
      url: "moments",
      icon: <FiZap size={25} />,
    },
  ];

  const { receivedConnectionPings } = userConnectionStore();

  const navigate = useNavigate();

  const location = useLocation();

  const handleNavigation = (url: string) => {
    if (isCalling) {
      ///NOTICE Show alert that user is in call
      return;
    } else {
      navigate(url);
    }
  };

  const hasIncomingRequests =
    Array.isArray(receivedConnectionPings) &&
    receivedConnectionPings.length > 0;

  const notifyHasConnectionEl = (
    <Float offset="1.5">
      <Flex
        ml="2"
        bg="red"
        color="white"
        p="5px"
        borderRadius="full"
        justifyContent="center"
        alignItems="center"
        fontSize="xs"
      ></Flex>
    </Float>
  );

  return (
    <Flex
      bg="bg"
      display={{ base: "flex", md: "none", lg: "none" }}
      justifyContent="space-evenly"
      alignItems="center"
      w="full"
      p="10px"
      minH="8%"
      borderTop="0.5px solid"
      borderColor="bg.emphasized"
    >
      {sideBarLinksArray.map((item) => {
        const isActive = location.pathname.includes(item.url);

        const isConnections = item.url === "connections";

        return (
          <Flex
            pos="relative"
            justifyContent="center"
            alignItems="center"
            key={item.url}
          >
            <Flex
              onClick={() => handleNavigation(item.url)}
              rounded="full"
              w="45px"
              pos="relative"
              minH="95%"
              p="10px"
              bg={isActive ? "bg.emphasized" : ""}
              cursor="pointer"
              _hover={{
                bg: "bg.emphasized",
              }}
              justifyContent="center"
              alignItems="center"
            >
              {item.icon}

              {isConnections && hasIncomingRequests && notifyHasConnectionEl}
            </Flex>
          </Flex>
        );
      })}

      <Flex pos="relative" justifyContent="center" alignItems="center">
        <Flex
          rounded="full"
          w="45px"
          pos="relative"
          minH="95%"
          p="10px"
          cursor="pointer"
          _hover={{
            bg: "bg.emphasized",
          }}
          justifyContent="center"
          alignItems="center"
        >
          <GrSettingsOption size={28} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AppNavigatorBig;
