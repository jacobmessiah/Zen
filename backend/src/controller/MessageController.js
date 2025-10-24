import { getAUserSocketId, io } from "../lib/io.js";
import imagekit from "../lib/kitUploader.js";
import Conversation from "../model/ConversationModel.js";
import Message from "../model/messageModel.js";

export const SendMessage = async (req, res) => {
  //add blocking func to check when a user is blocked
  try {
    const convoId = req.body.convoId;
    const type = req.body?.type;
    const tempId = req.body.tempId;
    const createdAt = req.body.createdAt;
    const user = req.user;
    const receiverId = req.body.receiverId;

    let response = {};

    const findConvo = await Conversation.findOne({ _id: convoId });

    if (!findConvo)
      return res.status(400).json({ message: "Conversation not Found" });

    if (!findConvo.hasMessages) {
      findConvo.hasMessages = true;
    }

    if (!type) return res.status(400).json({ message: "Type is Required" });

    if (type === "text-msg") {
      const text = req.body.text;
      const newMessage = await Message.create({
        conversationId: findConvo._id,
        text: text,
        senderId: user._id,
        receiverId: receiverId,
        tempId: tempId,
        createdAt: createdAt,
        type: type,
      });

      response.message = newMessage;
      const socketId = getAUserSocketId(receiverId);

      if (socketId) {
        io.to(socketId).emit("newMessage", newMessage);
      }
      const newCount =
        (findConvo.unreadCounts.get(receiverId.toString()) || 0) + 1;
      findConvo.unreadCounts.set(receiverId, newCount);

      await findConvo.save();
      return res.status(200).json(newMessage);
    }

    if (type === "image-msg") {
      console.log(type);
      const image = req.body.image;
      if (!image) return res.status(400).json({ message: "Image is Required" });

      const uploader = await imagekit.upload({
        file: image,
        folder: "Chat",
        fileName: crypto.randomUUID(),
      });

      const newMessage = new Message();
      newMessage.url = uploader.url;
      (newMessage.createdAt = createdAt),
        (newMessage.tempId = tempId),
        (newMessage.senderId = user._id);
      newMessage.receiverId = receiverId;
      newMessage.conversationId = convoId;
      newMessage.type = type;
      if (req.body.text) {
        newMessage.text = req.body.text;
      }

      await newMessage.save();

      const socketId = getAUserSocketId(receiverId);
      if (socketId) {
        io.to(socketId).emit("newMessage", newMessage);
      }
      const newCount =
        (findConvo.unreadCounts.get(receiverId.toString()) || 0) + 1;
      findConvo.unreadCounts.set(receiverId, newCount);

      await findConvo.save();

      return res.status(201).json(newMessage);
    }
  } catch (error) {
    console.log("error on sendMessage #MessageController.js", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const user = req.user;
    const convoId = req.params.convoId;
    const findConvo = await Conversation.findOne({ _id: convoId });
    findConvo.unreadCounts.set(user._id, 0);

    await findConvo.save();

    const allMessages = await Message.find({ conversationId: convoId });
    return res.status(200).json(allMessages);
  } catch (error) {
    console.log("Error on getMessage #messageController.js", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const markAsRead = async (data) => {
  try {
    const conversationId = data.conversationId;
    const user = data.user;

    const findConvo = await Conversation.findOne({ _id: conversationId });
    if (findConvo) {
      findConvo.unreadCounts.set(user, 0);
      await findConvo.save();
    }
    const String = `Updated Unread of ${user} from conversation = ${
      findConvo._id
    } to = ${findConvo.unreadCounts.get(user)}  `;
    return String;
  } catch (error) {
    console.log("Error on markAsRead", error);
  }
};




