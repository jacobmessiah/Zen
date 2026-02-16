import { create } from "zustand";
import type { GifData, IConversation, IMessage } from "../types/schema";
import { axiosInstance } from "@/utils";

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
  addConversation: (conversation: IConversation) => void;
  addPendingMessage: ({
    conversationId,
    message,
  }: {
    conversationId: string;
    message: IMessage;
  }) => void;

  updateMessageState: ({
    status,
    conversationId,
    tempId,
  }: {
    status: "sending" | "sent" | "delivered" | "read" | "failed";
    conversationId: string;
    tempId: string;
  }) => void;

  forwardMessage: ({
    conversationIds,
    messageContent,
  }: {
    messageContent: IMessage;
    conversationIds: string[];
  }) => void;

  deleteMessage: ({
    convoId,
    messageId,
    ignoreDBDelete,
  }: {
    convoId: string;
    messageId: string;
    ignoreDBDelete?: boolean;
  }) => void;

  getReactionCount: (count: number, locale: string) => string;
};
const userChatStore = create<userChatStoreTypes>((set, get) => ({
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

  addConversation: (conversation) => {
    set({
      conversations: [
        ...get().conversations.filter((p) => p._id !== conversation._id),
        conversation,
      ],
    });
  },
  addPendingMessage: ({ message, conversationId }) => {
    const hasMoreBottom = get().hasMoreBottom[conversationId];

    if (!hasMoreBottom) {
      const messages = get().storedMessages[conversationId] || [];

      const allMessages = [...messages, message];

      set((s) => {
        return {
          storedMessages: {
            ...s.storedMessages,
            [conversationId]: allMessages,
          },
        };
      });
    }
  },
  updateMessageState: ({ status, conversationId, tempId }) => {
    const messages = get().storedMessages[conversationId] || [];

    const updatedMessages =
      messages.length > 0
        ? messages.map((msg) => {
            if (msg._id === tempId) {
              return {
                ...msg,
                status,
              };
            } else {
              return msg;
            }
          })
        : [];

    set((s) => {
      return {
        storedMessages: {
          ...s.storedMessages,
          [conversationId]: updatedMessages,
        },
      };
    });
  },

  forwardMessage: async ({ conversationIds, messageContent }) => {
    const updateMessageState = get().updateMessageState;
    try {
      const res = await axiosInstance.post<{
        message: string;
        data: { conversationId: string }[];
      }>("/messages/forward", {
        messageContent,
        conversationIds: conversationIds,
      });

      const resData = res.data;

      resData.data.forEach((r) => {
        const { conversationId } = r;
        updateMessageState({
          conversationId: conversationId,
          tempId: messageContent._id,
          status: "sent",
        });
      });
    } catch (error) {
      conversationIds.forEach((id) => {
        updateMessageState({
          status: "failed",
          tempId: messageContent._id,
          conversationId: id,
        });
      });
      console.log("Failed to Forward Message");
    }
  },

  deleteMessage: async ({ convoId, messageId, ignoreDBDelete }) => {
    const allMessages = get().storedMessages[convoId] || [];

    const updatedMessages =
      allMessages.length > 0
        ? allMessages
            .filter((msg) => msg._id !== messageId) // Remove the message itself
            .map((msg) => {
              // Remove replyTo if it references the deleted message
              if (msg.replyTo?._id === messageId) {
                const { replyTo, ...messageWithoutReply } = msg;
                return messageWithoutReply as IMessage;
              }
              return msg;
            })
        : [];
    set((S) => {
      return {
        storedMessages: {
          ...S.storedMessages,
          [convoId]: updatedMessages,
        },
      };
    });

    if (ignoreDBDelete) return;
    try {
      await axiosInstance.delete(`/messages/delete`, {
        params: {
          convoId,
          messageId,
        },
      });
    } catch {
      console.log("Failed To Delete Message");
    }
  },

  getReactionCount: (count: number, locale: string = "en"): string => {
    if (count < 1000) {
      return new Intl.NumberFormat(locale).format(count);
    } else if (count < 1000000) {
      const k = count / 1000;
      return `${new Intl.NumberFormat(locale, { maximumFractionDigits: k < 10 ? 1 : 0 }).format(k)}K`;
    } else {
      const m = count / 1000000;
      return `${new Intl.NumberFormat(locale, { maximumFractionDigits: m < 10 ? 1 : 0 }).format(m)}M`;
    }
  },
}));

export default userChatStore;
