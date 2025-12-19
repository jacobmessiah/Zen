import { useEffect } from "react";
import authUserStore from "./store/authUserStore";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useColorMode } from "./components/ui/color-mode";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";;


import FriendContainer from "./app/friend/FriendContainer.jsx";
import HyperZenContainer from "./app/hyperzen/HyperZenContainer";
import MessengerContainer from "./app/messenger/MessengerContainer";
import AuthContainer from "./pages/auth/authContainer";
import LoginContainer from "./pages/auth/login/loginContainer";
import SignUpContainer from "./pages/auth/signup/signUpContainer";

const App = () => {
  const { checkAuth, isCheckingAuth, authUser } = authUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const { colorMode } = useColorMode();


  if (isCheckingAuth) {

    return (
      <Flex
        direction="column"
        justify="space-between"
        align="center"
        minW="100%"
        height="100vh"
        padding="10px"
      >
        <Box />

        <Image
          draggable={false}
          userSelect="none"
          pointerEvents="none"
          onClick={(e) => e.preventDefault()}
          animation="pulse 1.5s ease-in-out infinite"
          width="50px"
          filter={
            colorMode === "light"
              ? "drop-shadow(0 0 8px rgba(46, 51, 46, 0.6))"
              : "drop-shadow(0 0 8px rgba(201, 209, 201, 0.6))"
          }
          src={colorMode === "light" ? "/black.svg" : "/white.svg"}
        />

        <Text opacity={0} fontSize="12px" color="white" userSelect="none">
          Imperial Studio Inc
        </Text>
      </Flex>
    );
  }


  return (
    <div>
      <Toaster
        toastOptions={{
          style: {
            borderRadius: "100px",
            height: "55px",
            userSelect: "none",
          },
        }}
        richColors
        position="top-center"
      />
      <Routes>


        {/*Important Route */}
        <Route
          path="/"
          element={authUser ? <ZenPage /> : <Navigate to="/auth" />}
        >
          <Route index element={<FriendContainer />} />
          <Route path="hyperzen" element={<HyperZenContainer />} />
          <Route path="@me/:username" element={<MessengerContainer />} />
        </Route>
        {/*Important Route */}


        <Route path="/auth" element={authUser ? <Navigate to="/zen" /> : <AuthContainer />} >
          <Route index element={<LoginContainer />} />
          <Route path="signup" element={<SignUpContainer />} />
        </Route>



        {/*Alert Add Catch not found route here */}
      </Routes>
    </div>
  );
};

export default App;
