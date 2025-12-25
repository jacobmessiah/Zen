import { create } from "zustand";
import type { connectionPingType, IUser } from "../types/schema";

type userConnectionStoreTypes = {
  connections: IUser[];
  selectedConnection: IUser | null;
  onlineConnections: string[];
  receivedConnectionPings: connectionPingType[];
  sentConnectionPings: connectionPingType[];
};

const userConnectionStore = create<userConnectionStoreTypes>(() => ({
  connections: [],
  selectedConnection: null,
  onlineConnections: [],
  receivedConnectionPings: [],
  sentConnectionPings: [],
}));

export default userConnectionStore;
