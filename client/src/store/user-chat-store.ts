import { create } from "zustand";
import type { IConversation, IMessage } from "../types/schema";

type userChatStoreTypes = {
  conversations: IConversation[];
  selectedConversation: IConversation | null;
  isSearchingTenor: boolean;
  storedMessage: Record<string, IMessage[]>;
};
const userChatStore = create<userChatStoreTypes>(() => ({
  conversations: [],
  selectedConversation: null,
  isSearchingTenor: false,
  storedMessage: {},
}));

export default userChatStore;
