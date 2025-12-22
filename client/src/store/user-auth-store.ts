import { create } from "zustand";
import type { IUser } from "../types/schema";

type userAuthStore = {
  authUser: IUser | null;
  isLoginIn: boolean;
  isSigningUp: boolean;
  isCheckingAuth: boolean;
};

const userAuthStore = create<userAuthStore>(() => ({
  authUser: null,
  isLoginIn: false,
  isSigningUp: false,
  isCheckingAuth: false,
}));

export default userAuthStore;
