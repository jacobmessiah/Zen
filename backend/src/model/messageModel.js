import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    tempId: String,
    conversationId: {
      type: mongoose.Types.ObjectId,
      ref: "conversation",
    },
    senderId: String,
    receiverId: String,
    text: String,
    url: String,
    type: String,
    status: String,
    duration: Number,
  },
  { timestamps: true }
);

const Message = mongoose.model("message", messageSchema);

export default Message;
