import Friend from "../model/friendModel.js";
import User from "../model/userModel.js";
import Request from "../model/requestModel.js";
import { getAUserSocketId, io } from "../lib/io.js";

export const getFriends = async (req, res) => {
  try {
    const user = req.user;

    const findFriends = await Friend.find({
      $or: [{ senderId: user._id }, { receiverId: user._id }],
    })
      .populate("senderId", "-password")
      .populate("receiverId", "-password");
    const friends = [];

    for (const person of findFriends) {
      if (person.senderId._id.equals(user._id)) {
        friends.push(person.receiverId);
      } else if (person.receiverId._id.equals(user._id)) {
        friends.push(person.senderId);
      }
    }
    res.status(200).json(friends);
  } catch (error) {
    console.log(`Error on #getFriends #friendController`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addFriend = async (req, res) => {
  try {
    const user = req.user;

    let username = req.body?.username;

    if (username === user.username)
      return res.status(400).json({
        message: "Hmm Looks like something is wrong with your request ",
      });
    if (!username)
      return res.status(400).json({
        message: "Hmm Looks like something is wrong with your request ",
      });

    username = username.trim();

    const isUser = await User.findOne({ username: username });
    if (!isUser)
      return res.status(400).json({
        message: "Hmm Looks like something is wrong with your request ",
      });

    const checkFriend = await Friend.findOne({
      $or: [
        { senderId: user._id, receiverId: isUser._id },
        { senderId: isUser._id, receiverId: user._id },
      ],
    });

    if (checkFriend)
      return res
        .status(400)
        .json({ message: "You are Already Friends with this User" });

    const checkReq = await Request.findOne({
      $or: [{ senderId: isUser._id }, { receiverId: isUser._id }],
    });

    if (checkReq)
      return res.status(400).json({ message: "Existing Pending Request" });

    const newRequest = await Request.create({
      senderId: user._id,
      receiverId: isUser._id,
    });

    await newRequest.populate("senderId receiverId", "-password");

    //todo add socket.io to push to user when online

    const socketId = getAUserSocketId(isUser._id);
    console.log(socketId);

    if (socketId) {
      io.to(socketId).emit("newFriendReq", newRequest);
    }

    return res.status(200).json({
      data: newRequest,
      message: `Request was sent successfully to ${username} `,
    });
  } catch (error) {
    console.log(`Error on getRequests #friendController`, error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRequests = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(400).json({ message: "Invalid Request" });
    const allRequests = await Request.find({
      receiverId: user._id,
      status: "pending",
    }).populate("senderId");
    return res.status(200).json(allRequests);
  } catch (error) {
    console.log("error on getRequests #friendController.js ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPending = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(400).json({ message: "Unauthorized Request" });

    const allPending = await Request.find({ senderId: user._id }).populate(
      "receiverId",
      "-password -createdAt"
    );

    return res.status(200).json(allPending);
  } catch (error) {
    console.log("Error on friendcontroller.js", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const acceptReq = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(400).json({ message: "Unauthorized request" });

    const requestId = req.body.requestId;
    if (!requestId)
      return res.status(400).json({ message: "RequestId is required" });

    const findRequest = await Request.findOne({ _id: requestId });

    if (findRequest) {
      const newFriend = await Friend.create({
        senderId: findRequest.senderId,
        receiverId: findRequest.receiverId,
      });
      await findRequest.deleteOne();

      await newFriend.populate("senderId receiverId", "-password  -email ");

      const socketId = getAUserSocketId(findRequest.senderId);
      const mainUserSocket = getAUserSocketId(user._id);
      if (socketId) {
        io.to(socketId).emit("reqAccepted", newFriend.receiverId);
        io.to(socketId).emit("friendIsOnline", newFriend.receiverId._id);
        io.to(mainUserSocket).emit("friendIsOnline", newFriend.senderId._id);
      }
      return res.status(200).json(newFriend.senderId);
    } else {
      return res.status(400).json({ message: "error accepting Request" });
    }
  } catch (error) {
    console.log("Error or acceptReq", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllFriendsForSocket = async (userId) => {
  const friends = [];

  const isUser = await User.findOne({ _id: userId });
  if (!isUser) return null;

  const searchForData = await Friend.find({
    $or: [{ receiverId: userId }, { senderId: userId }],
  });

  for (const person of searchForData) {
    if (person.senderId.toString() === userId.toString()) {
      friends.push(person.receiverId);
    } else {
      friends.push(person.senderId);
    }
  }

  return friends;
};

export const deletePending = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(400).json({ message: "Unauthorized request" });
    const pendingId = req.body.pendingId;

    if (!pendingId)
      return res.status(400).json({ message: "Request Id is required" });

    const findRequest = await Request.findOne({ _id: pendingId });

    if (findRequest) {
      await findRequest.deleteOne();
      const socket = getAUserSocketId(findRequest.receiverId);
      if (socket) {
        io.to(socket).emit("redrawReq", findRequest._id);
      }
      return res.status(200).json({ message: "Request Deleted" });
    } else {
      return res.status(400).json({ message: "Request Failed" });
    }
  } catch (error) {
    console.log("Error on deleteRequest  #friendcontroller.js ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const rejectReq = async (req, res) => {
  try {
    const requestId = req.body.requestId;
    if (!requestId)
      return res.status(400).json({ message: "Request Id is required" });
    const findRequest = await Request.findOne({ _id: requestId });

    if (findRequest) {
      findRequest.status = "rejected";
      await findRequest.save();
      return res.status(200).json({ message: "Request Rejected" });
    } else {
      return res.status(400).json({ message: "Request not Found" });
    }
  } catch (error) {
    console.log("Error on rejectReq #friendcontroller.js", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const userId = req.user._id;
    const friendId = req.body.friendId;

    console.log(friendId);

    if (!friendId) return res.status(400).json({ message: "Invalid Request" });

    await Friend.findOneAndDelete({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    });

    return res.status(200).json({ message: "Friend Removed Successfully" });
  } catch (error) {}
};
