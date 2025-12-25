export interface IUser {
  displayName: string;
  username: string;
  password: string;
  email: string;
  dob: Date;
  profile: {
    profilePic: string;
  };
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  _id: string;
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
