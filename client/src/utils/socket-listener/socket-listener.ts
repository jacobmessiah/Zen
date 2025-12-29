import type { connectionPingType, ConnectionType } from "../../types/schema";
import {
  HANDLE_ADD_CONNECTION_PING,
  HANDLE_ADD_NEW_CONNECTION,
} from "./connection-event";

const ADD_EVENT_CASES = {
  ADD_RECEIVED_PING: "ADD_RECEIVED_PING",
  ADD_NEW_CONNECTION: "ADD_NEW_CONNECTION",
};

type ADD_EVENT_CASES_TYPES = {
  type: string;
  pingData?: connectionPingType;
  documentId: string;
  connectionData: ConnectionType;
};

// type REMOVE_EVENT_CASES_TYPES = {
//   type: string;
//   documentId: string;
// };

export const handleEventAdd = (args: ADD_EVENT_CASES_TYPES) => {
  switch (args.type) {
    case ADD_EVENT_CASES.ADD_RECEIVED_PING:
      HANDLE_ADD_CONNECTION_PING(args?.pingData || null);
      break;

    case ADD_EVENT_CASES.ADD_NEW_CONNECTION:
      HANDLE_ADD_NEW_CONNECTION(args.connectionData, args.documentId);
      break;
  }
};

// export const handleEventRemove = (args: REMOVE_EVENT_TYPES) => {};
