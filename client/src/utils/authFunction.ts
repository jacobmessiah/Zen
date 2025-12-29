import type { AxiosError } from "axios";
import userAuthStore from "../store/user-auth-store";
import type {
  checkUserResponse,
  loginDetails,
  signupDetails,
  signupResponse,
  usernameCheckResponse,
} from "../types";
import { axiosInstance } from ".";
import i8nextConfig from "../../i18next";
import { io } from "socket.io-client";
import userConnectionStore from "../store/user-connections-store";

const translate = i8nextConfig.getFixedT(null, "auth");

export const ConnectSocket = (userId: string) => {
  const BACKEND_SOCKET_URI = import.meta.env.VITE_BACKEND_URL;

  if (!BACKEND_SOCKET_URI) return;
  if (!userId) return;

  const socketInstance = userAuthStore.getState().socket;
  if (socketInstance) return;
  const newSocket = io(BACKEND_SOCKET_URI, {
    query: {
      userId: userId,
    },
    withCredentials: true,
  });
  userAuthStore.setState({ socket: newSocket });
};

export const handleCheckAuth = async () => {
  userAuthStore.setState({ isCheckingAuth: true });
  try {
    const res = await axiosInstance.get("/auth/check");
    const resData: checkUserResponse = res.data;

    userAuthStore.setState({ authUser: resData.authUser });
    userConnectionStore.setState({
      receivedConnectionPings: resData?.receivedConnectionPings || [],
      sentConnectionPings: resData?.sentConnectionPings || [],
      connections: resData.connections,
    });

    ConnectSocket(resData.authUser._id);
  } catch {
    userAuthStore.setState({ authUser: null });
  } finally {
    userAuthStore.setState({ isCheckingAuth: false });
  }
};

export const handleLogin = async (loginDetails: loginDetails) => {
  userAuthStore.setState({ isLoginIn: true });
  try {
    const res = await axiosInstance.post("/auth/login", { ...loginDetails });

    const returnObject = {
      isError: false,
      errorMessage: "",
      authUser: res.data.authUser,
    };

    return returnObject;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;

    const returnObject = {
      isError: true,
      errorMessage: axiosError.response?.data.message
        ? translate(
            `login.form.errorTexts.SERVER_ERRORS.${axiosError.response?.data.message}`
          )
        : translate("login.form.errorTexts.SERVER_ERRORS.NO_INTERNET"),
      authUser: null,
    };
    return returnObject;
  } finally {
    userAuthStore.setState({ isLoginIn: false });
  }
};

export const handleSignup = async (signupDetails: signupDetails) => {
  if (!signupDetails || typeof signupDetails !== "object") {
    return {
      isError: true,
      errorText: "Invalid Params. Please Reload",
      errorOnInput: false,
      authUser: null,
    };
  }

  userAuthStore.setState({ isSigningUp: true });
  const payload = {
    displayName: (signupDetails.displayName || "").trim(),
    email: (signupDetails.email || "").trim().toLowerCase(),
    username: (signupDetails.username || "").trim().toLowerCase(),
    password: signupDetails.password || "",
    dob: signupDetails.dob || null,
  };

  try {
    const res = await axiosInstance.post("/auth/signup", payload);

    const resData: signupResponse = res.data;
    const authUser = resData.authUser;

    return {
      isError: false,
      errorText: "",
      errorOnInput: "",
      authUser: authUser,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{
      message?: string;
      errorOnInput?: string;
    }>;

    const errorText = axiosError.response?.data?.message
      ? translate(
          `signup.form.errorTexts.SERVER_ERRORS.${axiosError.response?.data?.message}`
        )
      : translate("signup.form.errorTexts.SERVER_ERRORS.NO_INTERNET");
    const errorOnInput = axiosError.response?.data?.errorOnInput || false;

    return {
      isError: true,
      errorText,
      errorOnInput,
      authUser: null,
    };
  } finally {
    userAuthStore.setState({ isSigningUp: false });
  }
};

export const handleCheckUsername = async (usernameQueryKey: string) => {
  try {
    const res = await axiosInstance.post("/auth/username/check", {
      usernameQueryKey: usernameQueryKey,
    });

    const resData: usernameCheckResponse = res.data;
    const message = translate(`signup.form.usernameCheck.${resData.message}`);

    const returnObject = {
      message: message,
      isError: resData.isError || false,
      errorOnInput: resData.errorOnInput,
      usernameQueryKey: resData?.usernameQueryKey || usernameQueryKey,
    };

    return returnObject;
  } catch (error) {
    const axiosError = error as AxiosError<{
      message: string;
      isError: boolean;
      errorOnInput: boolean;
    }>;

    const message = translate(
      `signup.form.usernameCheck.${axiosError.response?.data.message}`
    );

    const returnObject = {
      message: message,
      isError: axiosError.response?.data.isError || true,
      errorOnInput: axiosError.response?.data.errorOnInput,
      usernameQueryKey: usernameQueryKey,
    };

    return returnObject;
  }
};
