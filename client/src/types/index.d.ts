import type { connectionPingType, ConnectionType, IUser } from "./schema";

export type loginDetails = {
  handle: string;
  password: string;
};

export type signupDetails = {
  displayName: string;
  email: string;
  username: string;
  password: string;
  dob: Date | null;
};

export type signupResponse = {
  isError: boolean;
  errorText: string;
  errorOnInput: boolean | string;
  authUser: IUser | null;
};

export type usernameCheckResponse = {
  isError: boolean;
  message: string;
  errorOnInput: boolean;
  usernameQueryKey?: string;
};

export type newConnectionPingResponse = {
  isSent: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  pingData?: connectionPingType;
};

export type TenorMediaObject = {
  url: string;
  dims: [number, number];
  duration: number;
  size: number;
  preview: string;
};

export type TenorContentFormats = {
  mp4: TenorMediaObject;
};

export type TenorResponseObject = {
  id: string;
  title: string;
  content_description: string;
  itemurl: string;
  media_formats: TenorContentFormats;
  created: number;
  tags: string[];
  url: string;
  flags: string[];
  hasaudio: boolean;
  content_description_source: string;
};

export type TenorCategoryObject = {
  searchterm: string;
  path: string;
  image: string;
  name: string;
};

export type TenorApiResponse<T = TenorResponseObject> = {
  results: T[];
  next?: string;
};

export type MessageActionTranslations = {
  addReaction: string;
  editMessage: string;
  replyMessage: string;
  forwardMessage: string;
  speakText: string;
  copyText: string;
  deleteMessage: string;
  moreText: string;
};

export type SocketPresenseEvent = {
  type: string;
  availability: "online" | "offline" | "dnd" | "idle";
  userId: string;
};
