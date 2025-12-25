import { create } from "zustand";
import type { IUser } from "../types/schema";

type userConnectionStoreTypes = {
  connections: IUser[];
  selectedConnection: IUser | null;
  onlineConnections: string[];
  pendingConnections: string[];
};

const userConnectionStore = create<userConnectionStoreTypes>(() => ({
  connections: [],
  selectedConnection: null,
  onlineConnections: [],
  pendingConnections: [],
}));

export default userConnectionStore;
