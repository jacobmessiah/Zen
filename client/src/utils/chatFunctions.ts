import axios from "axios";
import i18next from "../../i18next";
import type { TenorApiResponse } from "../types";
import type { IMessage } from "../types/schema";
import dayjs from "dayjs";
const translate = i18next.getFixedT("chat");
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import userChatStore from "../store/user-chat-store";
import { axiosInstance } from ".";

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

export const formatSeperatorTimestamp = (
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
