import axiosInstance from "@/config/AxiosInstance";
import authUserStore from "@/store/authUserStore";

const handleLogin = async (loginDetails) => {
  authUserStore.setState({ isLoginIn: true });
  try {
    const res = await axiosInstance.post("/auth/login", { ...loginDetails });

    const returnObject = {
      isError: false,
      errorMessage: "",
      authUser: res.data.authUser,
    };

    return returnObject;
  } catch (error) {
    const returnObject = {
      isError: true,
      errorMessage: error?.response?.data?.message || "No Internet Connection",
      authUser: null,
    };
    return returnObject;
  } finally {
    authUserStore.setState({ isLoginIn: false });
  }
};

const handleSignup = async (signupDetails) => {
  if (!signupDetails || typeof signupDetails !== "object") {
    return {
      isError: true,
      errorText: "Invalid signup details",
      errorOnInput: false,
      authUser: null,
    };
  }

  authUserStore.setState({ isSigningUp: true });
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
    const backendMessage = error?.response?.data?.message;
    const backendInput = error?.response?.data?.errorOnInput;

    return {
      isError: true,
      errorText: backendMessage || "No Internet Connection",
      errorOnInput: backendInput || false,
      authUser: null,
    };
  } finally {
    authUserStore.setState({ isSigningUp: false });
  }
};

export { handleLogin, handleSignup };
