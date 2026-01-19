import { create } from "zustand";
import type { IConversation, IMessage } from "../types/schema";

type userChatStoreTypes = {
  conversations: IConversation[];
  selectedConversation: IConversation | null;
  isSearchingTenor: boolean;
  storedMessages: Record<string, IMessage[]>;
  displayedMessages: IMessage[];
  isGettingMessages: boolean;

  hasMoreTop: Record<string, boolean>;
  hasMoreBottom: Record<string, boolean>;
  isViewingOld: Record<string, boolean>;
};
const userChatStore = create<userChatStoreTypes>(() => ({
  conversations: [],
  selectedConversation: null,
  isSearchingTenor: false,
  storedMessages: {},
  displayedMessages: [],
  isGettingMessages: false,

  hasMoreTop: {},
  isViewingOld: {},
  hasMoreBottom: {},
}));

export default userChatStore;
