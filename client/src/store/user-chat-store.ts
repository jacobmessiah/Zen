import { create } from "zustand";
import type { GifData, IConversation, IMessage } from "../types/schema";

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
  favouriteGifs: GifData[];
  p2pInitiatedReply: Record<string, string>;
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
  favouriteGifs: [],
  p2pInitiatedReply: {},
}));

export default userChatStore;
