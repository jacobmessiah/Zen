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

export interface BaseMessage {
  _id: string;
  tempId?: string;
  conversationId: string;
  senderId: string;
  receiverId?: string;
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  replyTo?: string;
  createdAt: string;
  updatedAt: string;
  reactions?: Record<string, { username: string; userId: string }[]>;
}

export type ImageMimeType =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/gif"
  | "image/avif";

export type VideoMimeType =
  | "video/mp4"
  | "video/webm"
  | "video/ogg"
  | "video/quicktime";

export type DocumentMimeType =
  | "application/pdf" // PDF
  | "application/msword" // Word DOC
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // Word DOCX
  | "application/vnd.ms-excel" // Excel XLS
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // Excel XLSX
  | "application/vnd.ms-powerpoint" // PowerPoint PPT
  | "application/vnd.openxmlformats-officedocument.presentationml.presentation" // PowerPoint PPTX
  | "text/plain"; // TXT

export type AudioMimeType =
  | "audio/mpeg" // MP3
  | "audio/wav" // WAV
  | "audio/ogg" // OGG
  | "audio/webm" // WebM
  | "audio/flac" // FLAC
  | "audio/aac" // AAC
  | "audio/mp4"; // M4A

export type AttachmentType = "image" | "video" | "audio" | "document";

export type MessageType = "default" | "gif";

export interface AttachmentBase {
  previewUrl: string;
  size: number;
  name: string;
  fileId: string;
  filePath?: string;
  file?: File;
  _id: string;
}

export interface ImageAttachment extends AttachmentBase {
  type: "image";
  mimeType: ImageMimeType;
}

export interface VideoAttachment extends AttachmentBase {
  type: "video";
  mimeType: VideoMimeType;
  duration?: number; // seconds
  width?: number;
  height?: number;
}

export interface AudioAttachment extends AttachmentBase {
  type: "audio";
  mimeType: AudioMimeType;
  duration?: number; // seconds
  bitrate?: number;
}

export interface DocumentAttachment extends AttachmentBase {
  type: "document";
  mimeType: DocumentMimeType;
}

export type Attachment =
  | ImageAttachment
  | VideoAttachment
  | AudioAttachment
  | DocumentAttachment;

export interface DefaultMessage extends BaseMessage {
  type: "default";
  text?: string;
  attachments?: Attachment[];
}

export interface GifMessage extends BaseMessage {
  type: "gif";
  gif: {
    url: string;
    name: string;
  };
}

export type IMessage = DefaultMessage | GifMessage;

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
  showFor: string[];
  unreadCount?: Record<string, number>;
}
