export interface IUser {
  displayName: string;
  username: string;
  password: string;
  email: string;
  dob: Date | string;
  profile: {
    profilePic: string;
  };
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  _id: string;
  __v: number;
}

export type connectionPingType = {
  from: string | IUser;
  to: string | IUser;
  message: string;
  isMessageRequest: boolean;
  spaceContextId?: string;
  showFor: string[];
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type ConnectionType = {
  createdAt: string;
  updateAt: string;
  _id: string;
  __v?: number;
  receiverId?: string;
  senderId?: string;
  otherUser: IUser;
};

interface BaseMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  replyTo?: string;
  isEdited?: boolean;
  updatedAt: Date | string;
  createdAt: Date | string;
}

export type MessageContent =
  | TextContent
  | GifContent
  | FileContent
  | AudioContent;

interface TextContent {
  type: "text";
  text: string;
}

interface GifContent {
  type: "gif";
  tenorId: string;
  url: string;
  previewUrl?: string;
  width: number;
  height: number;
  title?: string;
  tags?: string[];
}

interface FileContent {
  type: "file" | "image" | "video";
  url: string;
  fileName: string;
  width?: number;
  height?: number;
  fileSize: number;
  mimeType: string;
}

interface AudioContent {
  type: "audio";
  url: string;
  duration: number;
  waveform?: number[];
}

export interface IMessage extends BaseMessage {
  contents: MessageContent[];
}

export interface IConversation {
  createdAt: Date | string;
  updateAt?: Date | string;
  _id: string;
  otherUser: IUser;
  participants: [string, string];
  isTemp?: boolean;
  relation: "space" | "connection";
  connectionId?: string;
  spaceContext?: string;
}
