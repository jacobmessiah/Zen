import { create } from "zustand";
import type { connectionPingType, ConnectionType } from "../types/schema";

type userConnectionStoreTypes = {
  connections: ConnectionType[];
  selectedConnection: ConnectionType | null;
  onlineConnections: string[];
  receivedConnectionPings: connectionPingType[];
  sentConnectionPings: connectionPingType[];
  deletingConnectionPing: string[];
};

const userConnectionStore = create<userConnectionStoreTypes>(() => ({
  connections: [],
  selectedConnection: null,
  onlineConnections: [],
  receivedConnectionPings: [],
  sentConnectionPings: [],
  deletingConnectionPing: [],
}));

export default userConnectionStore;
