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
