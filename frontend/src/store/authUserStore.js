import axiosInstance from "@/config/AxiosInstance";
import { create } from "zustand";
import { io } from "socket.io-client";

const authUserStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isLoginIn: false,
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/users/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  permitEmail: false,
  isCheckingEmail: false,

  connectSocket: () => {
    const findSocket = get().socket;
    if (findSocket) {
      return;
    }
    const VITE_BACKEND_SOCKET_URL = import.meta.env.VITE_BACKEND_URL;
    const userId = get().authUser._id;
    const socket = io(VITE_BACKEND_SOCKET_URL, {
      query: { userId },
      withCredentials: true,
    });

    set({ socket: socket });
  },
}));

export default authUserStore;
