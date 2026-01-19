import { lazy, Suspense, useEffect } from "react";
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
import {
  handleEventAdd,
  handleEventRemove,
} from "./utils/socket-listener/socket-handler";
import { handleSyncAdd, handleSyncRemove } from "./utils/sync";

const LoadingAppUI = lazy(() => import("./app/loading-app-container"));

const App = () => {
  const authUser = userAuthStore((state) => state.authUser);
  const isCheckingAuth = userAuthStore((state) => state.isCheckingAuth);
  const isPoolingReconnection = userAuthStore(
    (state) => state.isPoolingReconnection,
  );

  const socket = userAuthStore((state) => state.socket);

  useEffect(() => {
    handleCheckAuth();
  }, [handleCheckAuth]);

  useEffect(() => {
    if (!socket) return;

    socket.on("EVENT:ADD", handleEventAdd);
    socket.on("EVENT:REMOVE", handleEventRemove);
    socket.on("SYNC:REMOVE", handleSyncRemove);
    socket.on("SYNC:ADD", handleSyncAdd);

    return () => {
      if (socket) {
        socket.off("SYNC:REMOVE", handleSyncRemove);
        socket.off("EVENT:ADD", handleEventAdd);
        socket.off("SYNC:ADD", handleSyncAdd);
      }
    };
  }, [socket]);

  console.log(
    "%cCAUGHT YOU!%c\n\n Why snitching just follow me on Linkedin --> https://www.linkedin.com/in/jacob-messiah/",
    "color: red; font-size: 52px; font-weight: bold;",
    "font-size: 18px;",
  );

  if (isCheckingAuth || isPoolingReconnection) {
    return (
      <Suspense>
        <LoadingAppUI />
      </Suspense>
    );
  }

  return (
    <div>
      <Toaster richColors position="top-center" />
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
