import { create } from "zustand";

type userResponsiveTypes = {
  showChatRenderer: boolean;
};

const userResponsiveStore = create<userResponsiveTypes>(() => ({
  showChatRenderer: false,
}));

export default userResponsiveStore;
