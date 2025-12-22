import type { AxiosError } from "axios";
import userAuthStore from "../store/user-auth-store";
import type { loginDetails, signupDetails } from "../types";
import type { IUser } from "../types/schema";
import { axiosInstance } from "./config";

export const handleCheckAuth = async () => {
  userAuthStore.setState({ isCheckingAuth: true });
  try {
    const res = await axiosInstance.get("/auth/check");
    const authUser: IUser = res.data;
    userAuthStore.setState({ authUser });
    
    console.log("Success")
  } catch {
    console.log("Failed")
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
      errorMessage:
        axiosError.response?.data.message || "No Internet Connection",
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
      errorText: "Invalid signup details",
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

    const authUser = res.data?.authUser;

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

    const errorText =
      axiosError.response?.data.message || "No internet connection";
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
