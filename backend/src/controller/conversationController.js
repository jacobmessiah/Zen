import Connection from "../model/connectionModel.js";
import Conversation from "../model/conversationModel.js";
import User from "../model/userModel.js";

export const handleCreateNewConversation = async (req, res) => {
  try {
    const user = req.user;

    const { connectionId, receiverId } = req?.body || {};

    //Alert change this check after Space is set
    if (!connectionId) {
      return res.status(400).json({ message: "CONNECTION_ID_REQUIRED" });
    }

    if (typeof connectionId !== "string") {
      return res
        .status(400)
        .json({ message: "INVALID_ID_GIVEN__REQUIRED_STRING" });
    }

    const findConnection = await Connection.findById(connectionId);

    if (!findConnection) {
      return res.status(400).json({ message: "NOT_CONNECTED" });
    }

    const otherUserId =
      findConnection.receiverId.toString() === user._id.toString()
        ? findConnection.senderId
        : findConnection.receiverId;

    const findOtherUser = await User.findById(otherUserId);

    if (!findOtherUser) return res.status(400).json({ message: "NO_USER" });

    const findConversation = await Conversation.findOne({
      connectionId: connectionId,
    });

    if (findConversation) {
      const returnObject = {
        ...findConversation.toObject(),
        otherUser: findOtherUser,
      };

      return res.status(200).json(returnObject);
    }

    const newConversation = await Conversation.create({
      participants: [findConnection.receiverId, findConnection.senderId],
      connectionId: findConnection._id,
      relation: "connection",
      showFor: [findOtherUser._id, user._id],
    });

    const returnObject = {
      ...newConversation.toObject(),
      otherUser: findOtherUser,
    };

    return res.status(201).json(returnObject);
  } catch (error) {
    console.log(
      "Error on handleCreateNewConversation",
      error?.message || error,
    );
    return res.status(500).json({ message: "SERVER_ERROR" });
  }
};

export const handleGetConversation = async (req, res) => {
  try {
    const user = req.user;
    const { conversationId } = req?.params || {};

    if (!conversationId || typeof conversationId !== "string")
      return res.status(400).json({ message: "CONVERSATION_ID_REQUIRED" });

    const findConversation = await Conversation.findById(conversationId);

    if (!findConversation)
      return res.status(400).json({ message: "NO_DOCUMENT" });

    const otherUserId = findConversation.participants.find(
      (p) => p.toString() !== user._id.toString(),
    );

    const otherUser = await User.findById(otherUserId);

    if (!otherUser) return res.status(400).json({ message: "USER_DELETED" });

    const returnObject = {
      ...findConversation.toObject(),
      otherUser: otherUser,
    };

    return res.status(200).json(returnObject);
  } catch (error) {
    console.log(
      "Error on #getConversation  #conversationController.js Error --->  ",
      error.message || error,
    );

    return res.status(500).json({ message: "SERVER_ERROR" });
  }
};
