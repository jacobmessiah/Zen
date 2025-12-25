import http from "http";
import express from "express";
import { Server } from "socket.io";
import User from "../model/userModel.js";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL;

console.log("FRONTEND_URL in io.js:", FRONTEND_URL);

const ConnectedUsersSocket = new Map();

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
});

const block = async (socket, next) => {
  const userId = socket.handshake.query.userId;

  if (!userId) {
    return console.log("Unauthorized Socket Connection Request Detected");
  }

  const findUser = await User.findOne({ _id: userId });
  ConnectedUsersSocket.set(userId, {
    userDetails: findUser,
    socketId: socket.id,
    handshakeTime: new Date(),
  });
  if (!findUser)
    return console.log(
      `Unauthorized Socket Connection Request Detected trying to connect with id --> ${userId}`
    );
  next();
};

io.use(block);

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(
    `User Connected with USERID --> ${userId} and SOCKETID --> ${socket.id}`
  );
});

export { io, server, app };
