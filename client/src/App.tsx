import { useEffect } from "react";

import { Flex, Image, Text } from "@chakra-ui/react";
import { useColorMode, type ColorMode } from "./components/ui/color-mode";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import AuthContainer from "./pages/auth/authContainer";
import LoginContainer from "./pages/auth/login/loginContainer";
import SignUpContainer from "./pages/auth/signup/signUpContainer";
import AppContainer from "./app/app-container";
import userAuthStore from "./store/user-auth-store";
import { handleCheckAuth } from "./utils/authFunction";

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
        {/*Important Route */}
        <Route
          path="/"
          element={authUser ? <AppContainer /> : <Navigate to="/auth" />}
        ></Route>
        {/*Important Route */}

        <Route
          path="/auth"
          element={authUser ? <Navigate replace to="/" /> : <AuthContainer />}
        >
          <Route index element={<LoginContainer />} />
          <Route path="signup" element={<SignUpContainer />} />
        </Route>

        {/*Alert Add Catch not found route here */}
      </Routes>
    </div>
  );
};

export default App;
