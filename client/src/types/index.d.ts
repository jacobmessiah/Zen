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

export type checkUserResponse = {
  receivedConnectionPings: connectionPingType[];
  sentConnectionPings: connectionPingType[];
  authUser: IUser;
  connections: ConnectionType[];
};
