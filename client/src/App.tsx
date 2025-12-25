import { useEffect } from "react";

import { Flex, Image } from "@chakra-ui/react";
import { useColorMode, type ColorMode } from "./components/ui/color-mode";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import AuthContainer from "./pages/auth/auth-container";
import LoginContainer from "./pages/auth/login/loginContainer";
import SignUpContainer from "./pages/auth/signup/signUpContainer";
import AppContainer from "./app/app-container";
import userAuthStore from "./store/user-auth-store";
import { handleCheckAuth } from "./utils/authFunction";
import HomePageContainer from "./pages/home-page/home-page-container";
import ChatsContainer from "./app/chat/chat-container";
import MomentsContainer from "./app/moment/momments-container";
import ConnectionsContainer from "./app/connections/connections-container";
import SpacesContainer from "./app/spaces/spaces-container";

const App = () => {
  const { isCheckingAuth, authUser } = userAuthStore();

  useEffect(() => {
    handleCheckAuth();
  }, [handleCheckAuth]);

  const { colorMode }: { colorMode: ColorMode } = useColorMode();

  if (isCheckingAuth) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        minW="100%"
        minHeight="100vh"
      >
        <Image
          draggable={false}
          onDrag={(e) => e.preventDefault()}
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
        {/*HomePage Route */}

        <Route path="/" element={<HomePageContainer />} />

        {/*HomePage Route */}

        {/*App Route */}
        <Route
          path="/app"
          element={authUser ? <AppContainer /> : <Navigate to="/auth" />}
        >
          <Route index element={<Navigate to="/app/chats" />} />
          <Route path="moments" element={<MomentsContainer />} />
          <Route path="connections" element={<ConnectionsContainer />} />
          <Route path="spaces" element={<SpacesContainer />} />
          <Route path="chats" element={<ChatsContainer />} />
        </Route>
        {/*App Route */}

        {/*Auth Routes */}
        <Route
          path="/auth"
          element={
            authUser ? <Navigate replace to="/app" /> : <AuthContainer />
          }
        >
          <Route index element={<LoginContainer />} />
          <Route path="signup" element={<SignUpContainer />} />
        </Route>
        {/*Auth Rout  es */}

        {/*Alert Add Catch not found route here */}
      </Routes>
    </div>
  );
};

export default App;
