import { Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import AuthRibbonBar, { LogoImage } from "./ui/authRibbonBar";
import { useEffect } from "react";

const AuthContainer = () => {



  return <Flex direction="column" pos="relative" minH="100vh" w="full" maxH="100vh" alignItems="center" justifyContent="center" >
    <AuthRibbonBar />





    <Flex border={{ base: "none", lg: { _dark: "1px solid gray" } }} boxShadow={{ base: "none", lg: { _light: "md" } }} rounded={{ lg: "2xl" }} flex={{ base: 1, lg: 0, md: 0 }} w={{ base: "100%", md: "70%", lg: "35%" }} direction="column" >
      <LogoImage />
      <Outlet />
    </Flex>
  </Flex>;
};

export default AuthContainer;
