import axiosInstance from "@/config/AxiosInstance";

const handleLogin = async (loginDetails) => {
  try {
    const res = await axiosInstance.post("/auth/login", { ...loginDetails });kw
    console.log(res.data);
  } catch (error) {
    const errorObject = {
      isError: true,
      errorMessage: error?.response?.data?.message || "No Internet Connection",
      authUser: null,
    };
    console.log(errorObject);
  }
};
