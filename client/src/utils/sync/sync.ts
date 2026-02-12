import userChatStore from "@/store/user-chat-store";
import type { connectionPingType, ConnectionType } from "../../types/schema";
import { HANDLE_REMOVE_CONNECTION } from "../socket-listener/connection-event";
import {
  SYNC_CONNECTIONS,
  ADD_SENT_PING_WITH_SYNC,
  REMOVE_RECEIVED_PING,
  REMOVE_SENT_PING_WITH_SYNC,
} from "./connectionSync";

type SYNC_ARGUMENTS = {
  type:
    | "REMOVE_SENT_PING"
    | "ADD_SENT_PING"
    | "REMOVE_RECEIVED_PING"
    | "ADD_CONNECTION"
    | "REMOVE_CONNECTION"
    | "DELETE_MESSAGE";
  documentId?: string;
  connectionPing?: connectionPingType;
  connectionData?: ConnectionType;
  messageId: string;
  conversationId: string;
};

const SYNC_TYPES = {
  REMOVE_SENT_PING: "REMOVE_SENT_PING",
  ADD_SENT_PING: "ADD_SENT_PING",
  REMOVE_RECEIVED_PING: "REMOVE_RECEIVED_PING",
  ADD_CONNECTION: "ADD_CONNECTION",
  REMOVE_CONNECTION: "REMOVE_CONNECTION",
} as const;

const deleteMessage = userChatStore.getState().deleteMessage;

export const handleSyncRemove = (arg: SYNC_ARGUMENTS) => {
  switch (arg.type) {
    case SYNC_TYPES.REMOVE_SENT_PING:
      REMOVE_SENT_PING_WITH_SYNC(arg.documentId);
      break;

    case SYNC_TYPES.REMOVE_RECEIVED_PING:
      REMOVE_RECEIVED_PING(arg.documentId);
      break;
    case SYNC_TYPES.REMOVE_CONNECTION:
      HANDLE_REMOVE_CONNECTION(arg.documentId);
      break;

    case "DELETE_MESSAGE":
      deleteMessage({ messageId: arg.messageId, convoId: arg.conversationId });
  }
};

export const handleSyncAdd = (arg: SYNC_ARGUMENTS) => {
  switch (arg.type) {
    case SYNC_TYPES.ADD_SENT_PING:
      if (arg.connectionPing) {
        ADD_SENT_PING_WITH_SYNC(arg.connectionPing);
      }
      break;

    case SYNC_TYPES.ADD_CONNECTION:
      if (arg.connectionData) {
        SYNC_CONNECTIONS(arg.connectionData, arg.documentId);
      }
  }
};
