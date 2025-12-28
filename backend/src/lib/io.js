import http from "http";
import express from "express";
import { Server } from "socket.io";
import User from "../model/userModel.js";
import dotenv from "dotenv";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import Session from "../model/sessionModel.js";

dotenv.config({ quiet: true });

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL;

console.log("FRONTEND_URL in io.js:", FRONTEND_URL);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
});

const connectedUserMap = new Map();

export const emitPayLoadToUser = (userId, emitDestination, emitPayload) => {
  if (!userId) {
    console.log("emitPayloadToUser didn't receive userId");
    return;
  }

  const stringedUser = userId.toString();

  const connectedUser = connectedUserMap.get(stringedUser.toString());

  if (!connectedUser) {
    console.log(
      "Tried to Push event on user with id of ",
      stringedUser,
      "but user is not online"
    );
    return;
  }

  connectedUser.forEach((connection) => {
    console.log(connection.socketId);
    io.to(connection.socketId).emit(emitDestination, emitPayload);
  });
};

export const emitPayloadToOtherSessions = (
  userId,
  emitDestination,
  emitPayload,
  sessionIdToAvoid
) => {
  if (!userId || !emitDestination || !emitPayload) {
    console.log(
      "#emitPayloadToOtherSessions #io.js. Stopped process because of missing arg"
    );
    return;
  }

  const connectedUser = connectedUserMap.get(userId.toString());

  if (!connectedUser) {
    console.log(
      "#emitPayloadToOtherSessions #io.js. Stopped Process because user was not found in socketMap"
    );
    return;
  }

  if (Array.isArray(connectedUser) && connectedUser.length < 1) {
    console.log("Only one Device Detected. No need for emit");
    return;
  }

  connectedUser.forEach((connected) => {
    if (connected.sessionId !== sessionIdToAvoid) {
      const socketId = connected.socketId;

      if (socketId) {
        io.to(socketId).emit(emitDestination, emitPayload);
      }
    }
  });
};

const updateMap = (userId, sessionId, socketId) => {
  const getExisting = connectedUserMap.get(userId);
  if (getExisting) {
    const object = { sessionId: sessionId, socketId: socketId };
    getExisting.push(object);
    connectedUserMap.set(userId, getExisting);
  } else {
    const newArray = [{ sessionId: sessionId, socketId: socketId }];
    connectedUserMap.set(userId, newArray);
  }
};

const protectSocket = async (socket, next) => {
  const rawCookies = socket.request?.headers?.cookie;

  if (!rawCookies) {
    console.log("Attempted socket connection without cookies");
    socket.disconnect();
    return;
  }

  const cookies = cookie.parseCookie(socket.request?.headers?.cookie || "");

  const ZenCookieToken = cookies.ZenChattyVerb;

  if (!ZenCookieToken) {
    console.log(
      "Attempted socket connection without ZenCookies --> ZenChattyVerb"
    );
    socket.disconnect();
    return;
  }

  let verify;

  try {
    verify = jwt.verify(ZenCookieToken, process.env.JWT_SECRET);
  } catch (error) {
    console.log(
      "Verify Failed on #io.js #protectSocket function error message --> ",
      error?.message || error
    );
    socket.disconnect();
    return;
  }

  const payLoad = verify;

  const userId = payLoad.userId;
  const sessionId = payLoad.sessionId;

  if (!userId || !sessionId) {
    console.log(
      "Attempted connection without required ids supposed to be in cookies"
    );
    socket.disconnect();
    return;
  }

  const userDetails = await User.findOne({ _id: userId });
  const userSession = await Session.findOne({ _id: sessionId });

  if (!userDetails) {
    console.log(
      "Attempted connection with id of USER schema with no existing value"
    );
    socket.disconnect();
    return;
  }

  if (!userSession) {
    console.log(
      "Attempted connection with id of SESSION schema with no existing value"
    );
    socket.disconnect();
    return;
  }

  socket.userId = userDetails._id;
  socket.sessionId = userSession._id;
  socket.user = userDetails;

  updateMap(userDetails._id.toString(), userSession._id.toString(), socket.id);
  next();
};

export const getUserSocket = (userId) => {
  if (!userId) return null;

  const key = String(userId);
  const user = connectedUsers.get(key);

  if (!user || !user.socketId) return null;

  return user.socketId;
};

io.use(protectSocket);

io.on("connection", (socket) => {
  const userId = socket.userId;
  console.log(
    `User Connected with USERID --> ${userId} and SOCKETID --> ${socket.id}`
  );
});

export { io, server, app };
