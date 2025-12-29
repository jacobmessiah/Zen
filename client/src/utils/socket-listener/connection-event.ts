import { notificationService } from "..";
import userConnectionStore from "../../store/user-connections-store";
import type { connectionPingType, ConnectionType } from "../../types/schema";

export const HANDLE_ADD_CONNECTION_PING = (args: connectionPingType | null) => {
  if (!args) return;
  const existingReceivedPings =
    userConnectionStore.getState().receivedConnectionPings;

  const filteredConnections = existingReceivedPings.filter(
    (connection) => connection._id !== args._id
  );

  userConnectionStore.setState({
    receivedConnectionPings: [...filteredConnections, args],
  });

  notificationService.playConnection();
};

export const HANDLE_ADD_NEW_CONNECTION = (
  connectionData: ConnectionType | null,
  documentId: string | null
) => {
  if (!documentId || !connectionData) return;

  /// Reason is user cannot accept connection when they are not the receiver of the ping
  const allSentConnectionPings =
    userConnectionStore.getState().sentConnectionPings;
  const allConnections = userConnectionStore.getState().connections;

  userConnectionStore.setState({
    sentConnectionPings: [
      ...allSentConnectionPings.filter((cn) => cn._id !== documentId),
    ],
    connections: [
      ...allConnections.filter((cn) => cn?._id !== connectionData._id),
      connectionData,
    ],
  });
};
