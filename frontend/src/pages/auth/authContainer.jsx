import { Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import AuthRibbonBar from "./ui/authRibbonBar";

const AuthContainer = () => {

  return <Flex direction="column" pos="relative" minH="100vh" w="full" maxH="100vh" alignItems="center" justifyContent={{ base: "flex-end", lg: "center" }} >
    <AuthRibbonBar />


    <Flex padding={{ base: "10px", lg: "none" }} flex={{ base: 1, lg: 0 }} w={{ base: "100%", md: "70%", lg: "35%" }}
      minH={{ base: "80%", md: "60%", lg: "60%" }} boxShadow={{ base: "md", md: "none", lg: "md" }} rounded={{ lg: "2xl" }} roundedTop={{base: "5%"}} >
      <Outlet />
    </Flex>
  </Flex>;
};

export default AuthContainer;
