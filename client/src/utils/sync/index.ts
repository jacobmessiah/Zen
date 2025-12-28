import type { connectionPingType, ConnectionType } from "../../types/schema";
import {
  SYNC_CONNECTIONS,
  ADD_SENT_PING_WITH_SYNC,
  REMOVE_RECEIVED_PING,
  REMOVE_SENT_PING_WITH_SYNC,
} from "./connectionSync";

const SYNC_TYPES = {
  REMOVE_SENT_PING: "REMOVE_SENT_PING",
  ADD_SENT_PING: "ADD_SENT_PING",
  REMOVE_RECEIVED_PING: "REMOVE_RECEIVED_PING",
  ADD_CONNECTION: "ADD_CONNECTION",
};

type SYNC_ARGUMENTS = {
  type: string;
  documentId?: string;
  connectionPing?: connectionPingType;
  connectionData?: ConnectionType;
};

export const handleSyncRemove = (arg: SYNC_ARGUMENTS) => {
  switch (arg.type) {
    case SYNC_TYPES.REMOVE_SENT_PING:
      REMOVE_SENT_PING_WITH_SYNC(arg.documentId);
      break;

    case SYNC_TYPES.REMOVE_RECEIVED_PING:
      REMOVE_RECEIVED_PING(arg.documentId);
      break;
  }
};

export const handleSyncAdd = (arg: SYNC_ARGUMENTS) => {
  switch (arg.type) {
    case SYNC_TYPES.ADD_SENT_PING:
      if (arg.connectionPing) {
        ADD_SENT_PING_WITH_SYNC(arg?.connectionPing);
      }
      break;

    case SYNC_TYPES.ADD_CONNECTION:
      if (arg.connectionData) {
        SYNC_CONNECTIONS(arg.connectionData, arg.documentId);
      }
  }
};
