import type { AxiosError } from "axios";
import i8nextConfig from "../../i18next";
import { axiosInstance, notificationService } from "./config";
import userConnectionStore from "../store/user-connections-store";
import type { connectionPingType } from "../types/schema";
import type { newConnectionPingResponse } from "../types";
const translate = i8nextConfig.getFixedT(null, "connection");

export const createNewConnection = async (pingArg: string) => {
  try {
    const res = await axiosInstance.post("/connections/new", {
      pingArg: pingArg,
    });

    const resData: { pingData: connectionPingType; message: string } = res.data;

    const pendingConnections =
      userConnectionStore.getState().sentConnectionPings;

    const filteredConnection = pendingConnections.filter(
      (cn) => cn._id !== resData.pingData._id
    );

    userConnectionStore.setState({
      sentConnectionPings: [...filteredConnection, resData.pingData],
    });

    const returnObject: newConnectionPingResponse = {
      isSuccess: true,
      isSent: true,
      isError: false,
      message: translate(`NewConnectionResponses.${resData.message}`),
    };
    return returnObject;
  } catch (error) {
    const axiosError = error as AxiosError<{
      message: string;
    }>;

    const message = translate(
      `NewConnectionResponses.${axiosError.response?.data.message}`
    );

    const returnObject = {
      isError: true,
      message,
      pingData: undefined,
      isSent: false,
      isSuccess: false,
    };
    return returnObject;
  }
};

export const newConnectionSocketHandler = async (args: connectionPingType) => {
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
