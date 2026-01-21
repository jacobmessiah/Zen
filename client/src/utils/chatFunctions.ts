import axios, { AxiosError } from "axios";
import i18next from "../../i18next";
import type { TenorApiResponse } from "../types";
import type { Attachment, IConversation, IMessage } from "../types/schema";
import dayjs from "dayjs";
const translate = i18next.getFixedT("chat");
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import userChatStore from "../store/user-chat-store";
import { axiosInstance } from ".";
import { toast } from "sonner";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

export const MAX_MESSAGE_PER_STORAGE = 120;

export const searchTenor = async (queryKey: string) => {
  try {
    const TENOR_API_KEY = import.meta.env.VITE_TENOR_API_KEY;

    const locale = i18next.language;

    const params = new URLSearchParams({
      key: TENOR_API_KEY || "",
      q: queryKey,
      limit: "30",
      locale,
      media_filter: "mp4",
    });

    const url = `https://tenor.googleapis.com/v2/search?${params.toString()}`;

    const res = await axios.get(url);

    const resData: TenorApiResponse = res.data;

    console.log("ResData", resData);
    return { results: resData.results, isError: false, errMessage: "" };
  } catch (error) {
    const message = translate("TenorSearchFailed");
    return { results: [], isError: false, errMessage: message };
  }
};

export const formatMessageTimestamp = (timestamp: string | Date) => {
  const msgDate = dayjs(timestamp).locale(i18next.language);

  if (msgDate.isToday()) {
    return msgDate.format("h:mm A");
  }

  if (msgDate.isYesterday()) {
    return `Yesterday ${msgDate.format("h:mm A")}`;
  }

  return msgDate.format("M/D/YYYY h:mm A");
};

export const formatSeparatorTimestamp = (
  createdAt: string | Date,
): string | null => {
  try {
    const createdAtDate = new Date(createdAt);

    const intlFormat = new Intl.DateTimeFormat(i18next.language, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const data = intlFormat.format(createdAtDate);
    return data;
  } catch (error) {
    console.log(
      "Failed to format language demarcation",
      (error as Error)?.message || error,
    );

    return null;
  }
};

export const formatDateForTooltip = (date: Date | string) => {
  return new Intl.DateTimeFormat(i18next.language, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
};

export const formatDateSimpleStyle = (createdAt: string | Date) => {
  const intlFormat = new Intl.DateTimeFormat(i18next.language, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const returnString = intlFormat.format(new Date(createdAt));

  return returnString;
};

export const getMessages = async (conversationId: string) => {
  userChatStore.setState({ isGettingMessages: true });
  try {
    if (!conversationId) return;

    const getMessagesFromStore =
      userChatStore.getState().storedMessages[conversationId];

    if (getMessagesFromStore) {
      userChatStore.setState({ displayedMessages: getMessagesFromStore });
      return;
    }
    const res = await axiosInstance.get(`/messages/get/all/${conversationId}`);

    const resData: IMessage[] = res.data;

    userChatStore.setState((state) => ({
      storedMessages: {
        ...state.storedMessages,
        [conversationId]: resData,
      },
      displayedMessages: resData,
    }));
  } catch (error) {
    console.log("Request to get messages failed", error);
    userChatStore.setState({ displayedMessages: [] });
  } finally {
    userChatStore.setState({ isGettingMessages: false });
  }
};

export const copyText = async (text: string) => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  }
};

const updateMessage = (
  message: IMessage,
  conversationId: string | undefined,
  isFromTemp: boolean,
  tempId: string | undefined,
) => {
  if (!conversationId || typeof conversationId !== "string") return;

  if (isFromTemp && tempId) {
    userChatStore.setState((state) => {
      const storedMessages = state.storedMessages[conversationId!] || [];

      const updatedMessages = storedMessages.map((msg) => {
        if (msg.tempId && msg.tempId === tempId) {
          return message;
        }
        return msg;
      });

      const displayedMessages =
        state.selectedConversation &&
        state.selectedConversation._id === conversationId
          ? updatedMessages
          : (state.displayedMessages ?? []);

      return {
        storedMessages: {
          ...state.storedMessages,
          [conversationId]: updatedMessages,
        },
        displayedMessages: displayedMessages,
      };
    });
  }
};

export const sendMessage = async (
  inputValue: string,
  attachments: Attachment[],
  senderId: string | undefined,
  receiverId: string | undefined,
  conversationId: string | undefined,
  connectionId: string | undefined,
) => {
  try {
    if (!senderId || !receiverId || !conversationId || !connectionId) return;
    if (inputValue.trim().length < 1 && attachments.length < 1) return;

    const tempId = crypto.randomUUID();

    // First Check for conversation in store

    let conversation = userChatStore
      .getState()
      .conversations.find((p) => p._id === conversationId);

    if (!conversation || conversation.isTemp) {
      const res = await axiosInstance.post("/conversations/create", {
        connectionId,
      });

      conversation = res.data;
      const resData: IConversation = res.data;
      userChatStore.setState((state) => ({
        conversations: [resData!, ...state.conversations],
        selectedConversation: resData,
      }));
    }

    if (!conversation) {
      toast.error(translate("ConversationCreateFailed"));
      return;
    }

    const newMessage: IMessage = {
      senderId,
      receiverId,
      type: "default",
      conversationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tempId,
      _id: tempId,
      status: "sending",
    };

    if (inputValue && inputValue.trim().length > 1) {
      newMessage.text = inputValue;
    }

    if (attachments.length > 0) {
      newMessage.attachments = attachments;
    }

    userChatStore.setState((state) => {
      const storedMessages = state.storedMessages[conversationId] || [];
      const overflow = storedMessages.length + 1 - MAX_MESSAGE_PER_STORAGE;
      const updatedMessages =
        overflow > 0
          ? [...storedMessages.slice(overflow), newMessage]
          : [...storedMessages, newMessage];

      const displayedMessages =
        state.selectedConversation &&
        state.selectedConversation._id === conversationId
          ? updatedMessages
          : (state.displayedMessages ?? []);

      return {
        storedMessages: {
          ...state.storedMessages,
          [conversationId]: updatedMessages,
        },
        displayedMessages: displayedMessages,
      };
    });

    /*Send Logic */

    if (attachments.length > 0) {
      const formData = new FormData();

      for (const attachment of attachments) {
        if (attachment.file) {
          formData.append("attachment", attachment.file);
        }

        URL.revokeObjectURL(attachment.previewUrl);
      }

      const response = await axiosInstance.post(
        "/messages/upload/attachments",
        formData,
      );

      const resData: Attachment[] = response.data;

      newMessage["attachments"] = resData;
    }

    try {
      const res = await axiosInstance.post("/messages/send", {
        ...newMessage,
      });

      const resData: IMessage = res.data;
      updateMessage(resData, conversationId, true, tempId);
    } catch (error) {
      userChatStore.setState((state) => {
        const storeMessages = state.storedMessages[conversationId!] ?? [];

        const updatedMessages = storeMessages.map((msg) => {
          if (msg.tempId && msg.tempId === tempId) {
            const nMsg: IMessage = {
              ...msg,
              status: "failed",
            };
            return nMsg;
          }
          return msg;
        });

        const displayedMessages = !state.selectedConversation
          ? []
          : state.selectedConversation._id === conversationId
            ? updatedMessages
            : state.displayedMessages;

        return {
          displayedMessages,
          storedMessages: {
            ...state.storedMessages,
            [conversationId!]: updatedMessages,
          },
        };
      });
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string; tempId: string }>;
    console.log(
      "Send failed server reason -->",
      axiosError.response?.data.message || error,
    );
  }
};
