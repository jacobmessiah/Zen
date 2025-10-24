import http, { OutgoingMessage } from "http";
import express from "express";
import { Server } from "socket.io";

import { getAllFriendsForSocket } from "../controller/friendController.js";
import { markAsRead } from "../controller/MessageController.js";
import { socketViewedStatus } from "../controller/StatusController.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
const userIdSocketMap = new Map();
// userId = socketid

const socketIdMap = new Map();
// socketid = userId

const incomingCallArray = new Array();

export const getAUserSocketId = (userId) => {
  return userIdSocketMap.get(userId.toString());
};

const block = (socket, next) => {
  const authUser = socket.handshake.query.userId;
  

  if (!authUser) {
    return console.log("Unauthorized Socket Connection Request Detected");
  }

  next();
};

io.use(block);

io.on("connection", async (socket) => {
  console.log("A user connected", socket.id);
  const userId = socket.handshake.query.userId;

  if (!userId) return;

  if (userIdSocketMap.has(userId)) {
    userIdSocketMap.delete(userId);
  }
  if (socketIdMap.has(socket.id)) {
    socketIdMap.delete(socket.id);
  }

  const isSomeoneCallingMe = incomingCallArray.find(
    (call) => call.receiverId === userId
  );

  console.log("This is My Calls", isSomeoneCallingMe);

  userIdSocketMap.set(userId, socket.id);
  socketIdMap.set(socket.id, userId);

  socket.data.getFriends = await getAllFriendsForSocket(userId);

  if (socket.data.getFriends.length < 1) return;
  socket.data.getFriends.forEach((friend) => {
    const friendSocket = userIdSocketMap.get(friend.toString());
    if (friendSocket) {
      io.to(friendSocket).emit("friendIsOnline", userId);
    }
  });
  const AllOnlineFriends = socket.data.getFriends.filter((person) =>
    userIdSocketMap.has(person.toString())
  );
  socket.emit("onlineFriendList", AllOnlineFriends);

  socket.on("disconnect", async (reason) => {
    console.log("User disconnected :", reason);

    const getUserId = socketIdMap.get(socket.id);

    userIdSocketMap.delete(getUserId);
    socketIdMap.delete(socket.id);
    if (socket.data.getFriends.length < 1) return;
    socket.data.getFriends.forEach((friendId) => {
      const friendSocket = userIdSocketMap.get(friendId.toString());
      if (friendSocket) {
        io.to(friendSocket).emit("userDisconnect", getUserId);
      }
    });
  });

  socket.on("markRead", async (data) => {
    const res = await markAsRead(data);
    console.log(res);
  });

  socket.on("viewedStatus", (data) => socketViewedStatus(data));

  //Call Sockets Events and Emits

  socket.on("call:start", (data) => {
    const receiverId = data.receiverId;
    console.log(data)
    if (!receiverId) return;

    const isAlreadyCallingUser = incomingCallArray.find(
      (call) => call.receiverId === receiverId
    );

    if (data) {
      incomingCallArray.push(data);
      const isReceiverOnline = userIdSocketMap.get(receiverId);
      if (isReceiverOnline) {
        io.to(isReceiverOnline).emit("call:ring", data);
      }
    }
  });

  //Listener for offer from client
  socket.on("call:server:offer", (args) => {
    const receiverSocketId = userIdSocketMap.get(args.answerer);
    console.log("Collecting offerSDP from ", receiverSocketId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call:client:offer", args);
    }
  });

  //Listener for ice from client
  socket.on("call:server:ice", (args) => {
    const receiverSocketId = userIdSocketMap.get(args.answerer);
    console.log("Collecting Ice from ", receiverSocketId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call:client:ice", args);
    }
  });

  socket.on("call:server:answer", (args) => {
    const receiverSocketId = userIdSocketMap.get(args.answerer);
    console.log("Receiving answer SDP from ", receiverSocketId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call:client:answer", args);
    }
  });

  socket.on("call:request:video:server", (args) => {
    console.log(args);
    const receiverSocketId = userIdSocketMap.get(args.to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call:request:video", args);
    }
  });

  socket.on("call:negotiation:offer:server", (args) => {
    const receiverSocket = userIdSocketMap.get(args.to);
    if (receiverSocket) {
      io.to(receiverSocket).emit("call:negotiation:offer:client", args);
    }
  });

  socket.on("call:negotiation:answer:server", (args) => {
    const receiverSocket = userIdSocketMap.get(args.to);

    if (receiverSocket) {
      io.to(receiverSocket).emit("call:negotiation:answer:client", args);
    }
  });

  //Call Sockets Events and Emits
});

export { io, server, app };
