import { create } from "zustand";
import type {
  Attachment,
  IConversation,
  IMessage,
  IUser,
} from "../types/schema";
import type { GifData } from "@/types";

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

  selectedVisualAttachments: {
    attachments: Extract<Attachment, { type: "video" | "image" }>[];
    createdAt: string;
    senderProfile: IUser | undefined;
  } | null;
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
  selectedVisualAttachments: null,
}));

export default userChatStore;
