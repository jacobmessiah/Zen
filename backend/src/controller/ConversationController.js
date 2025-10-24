import mongoose from "mongoose";
import Conversation from "../model/ConversationModel.js";

export const getConversations = async (req, res) => {
  try {
    const user = req.user;

    const convo = await Conversation.find({
      participants: { $in: [user._id] },
      hasMessages: true,
    }).populate("participants", "username profile name tags");
    return res.status(200).json(convo);
  } catch (error) {
    console.log("error on getConversation #conversationController.js", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const addConversation = async (req, res) => {
  try {
    const participants = req.body.participants;
    const participantsIds = participants.map((user) => user._id);

    const findConvo = await Conversation.findOne({
      participants: { $all: participantsIds, $size: participantsIds.length },
    }).populate(
      "participants",
      "-password -email -loginType -admin -isUsernameFinalized"
    );

    if (findConvo) {
      const convoObject = findConvo.toObject();

      return res
        .status(200)
        .json({ ...convoObject, otherParticipant: req.body.otherParticipant });
    } else {
      const createConvo = await Conversation.create({
        participants: [...participants],
      });
      await createConvo.populate(
        "participants",
        "-password -email -loginType -admin -isUsernameFinalized"
      );

      const convoObject = createConvo.toObject();

      return res
        .status(200)
        .json({ ...convoObject, otherParticipant: req.body.otherParticipant });
    }
  } catch (error) {
    console.log("error on addConversation #conversationController.js", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const getConversation = async (req, res) => {
  try {
    const convoId = req.params.convoId;
    console.log(convoId);
    if (!convoId)
      return res.status(400).json({ message: "ConversationId is Required" });
    if (!mongoose.Types.ObjectId.isValid(convoId)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }
    const findConvo = await Conversation.findById(convoId).populate(
      "participants",
      "-password -isUsernameFinalized -isAdmin"
    );
    !findConvo
      ? res.status(400).json({ message: "Convo not Found" })
      : res.status(200).json(findConvo);
  } catch (error) {
    console.log("Error on getConversation #ConversationController.js", error);
    return res.status(500).json({ message: "internal server error" });
  }
};
