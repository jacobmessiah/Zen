import { create } from "zustand";
import type { IUser } from "../types/schema";
import type { Socket } from "socket.io-client";

type userAuthStore = {
  authUser: IUser | null;
  isLoginIn: boolean;
  isSigningUp: boolean;
  isCheckingAuth: boolean;
  isCheckingUsername: boolean;
  socket: Socket | null;
  notificationService: HTMLAudioElement;
};

const userAuthStore = create<userAuthStore>(() => ({
  authUser: null,
  isLoginIn: false,
  isSigningUp: false,
  isCheckingAuth: false,
  isCheckingUsername: false,
  socket: null,
  notificationService: new Audio(),
}));

export default userAuthStore;
