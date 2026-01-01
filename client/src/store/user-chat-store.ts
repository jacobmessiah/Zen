import { create } from "zustand";
import type { IConversation } from "../types/schema";

type userChatStoreTypes = {
  conversations: IConversation[];
  selectedConversation: IConversation | null;
  isSearchingTenor: boolean;
};
const userChatStore = create<userChatStoreTypes>(() => ({
  conversations: [],
  selectedConversation: null,
  isSearchingTenor: false,
}));

export default userChatStore;
