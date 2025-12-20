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

export { handleLogin };
