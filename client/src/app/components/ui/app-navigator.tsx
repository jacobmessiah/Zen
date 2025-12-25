import { Box, Flex } from "@chakra-ui/react";
import { FiLayers, FiZap } from "react-icons/fi";
import { HiOutlineShare } from "react-icons/hi";
import { BiMessageSquare } from "react-icons/bi";
import { Tooltip } from "../../../components/ui/tooltip";
import { useColorModeValue } from "../../../components/ui/color-mode";
import userCallStore from "../../../store/user-call-store";
import { useLocation, useNavigate } from "react-router-dom";

const AppNavigatorBig = () => {
  const { isCalling } = userCallStore();

  const sideBarLinksArray = [
    {
      text: "Chats",
      url: "chats",
      icon: <BiMessageSquare size={22} />,
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

export default AppNavigatorBig;
