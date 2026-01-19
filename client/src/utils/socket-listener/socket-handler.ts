import type {
  connectionPingType,
  ConnectionType,
  IMessage,
} from "../../types/schema";
import { HANDLE_NEW_TYPING, HANDLE_RECEIVE_NEW_MESSAGE } from "./chat-events";
import {
  HANDLE_ADD_CONNECTION_PING,
  HANDLE_ADD_NEW_CONNECTION,
  HANDLE_ADD_NEW_PRESENSE,
  HANDLE_REMOVE_CONNECTION,
  HANDLE_REMOVE_USER_PRESENSE,
} from "./connection-event";

const ADD_EVENT_CASES = {
  ADD_RECEIVED_PING: "ADD_RECEIVED_PING",
  ADD_NEW_CONNECTION: "ADD_NEW_CONNECTION",
  ADD_NEW_PRESENSE: "ADD_NEW_PRESENSE",
  TYPING_RECEIVE: "TYPING_RECEIVE",
  RECEIVE_MESSAGE: "RECEIVE_MESSAGE",
};

type ADD_EVENT_CASES_TYPES = {
  type: string;
  pingData?: connectionPingType;
  documentId: string;
  connectionData: ConnectionType;
  userId: string;
  availability: "online" | "offline" | "dnd" | "idle";
  message: IMessage;
};

//Lesson.  Do not Join Types like this in the sense that specific response or events get there own types

type REMOVE_EVENT_CASES_TYPES = {
  type: "REMOVE_CONNECTION" | "REMOVE_USER_PRESENCE";
  documentId: string;
  userId: string;
};

export const handleEventAdd = (args: ADD_EVENT_CASES_TYPES) => {
  switch (args.type) {
    case ADD_EVENT_CASES.ADD_RECEIVED_PING:
      HANDLE_ADD_CONNECTION_PING(args?.pingData || null);
      break;

    case ADD_EVENT_CASES.ADD_NEW_CONNECTION:
      HANDLE_ADD_NEW_CONNECTION(args.connectionData, args.documentId);
      break;

    case ADD_EVENT_CASES.ADD_NEW_PRESENSE:
      HANDLE_ADD_NEW_PRESENSE(args);
      break;

    case ADD_EVENT_CASES.TYPING_RECEIVE:
      HANDLE_NEW_TYPING(args.userId);
      break;

    case ADD_EVENT_CASES.RECEIVE_MESSAGE:
      HANDLE_RECEIVE_NEW_MESSAGE(args.message);
      break;
  }
};

export const handleEventRemove = (args: REMOVE_EVENT_CASES_TYPES) => {
  switch (args.type) {
    case "REMOVE_CONNECTION":
      HANDLE_REMOVE_CONNECTION(args.documentId);
      break;

    case "REMOVE_USER_PRESENCE":
      HANDLE_REMOVE_USER_PRESENSE(args.userId);
      break;
  }
};
