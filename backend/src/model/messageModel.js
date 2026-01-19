import mongoose from "mongoose";

const AttachmentBaseSchema = new mongoose.Schema({
  type: { type: String, enum: ["image", "video", "audio", "document"], required: true },
  url: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  name: { type: String, required: true },
  createdAt: { type: String, required: true },
  fileId: { type: String, required: true },
});

const ImageAttachmentSchema = new mongoose.Schema({
  ...AttachmentBaseSchema.obj,
  type: { type: String, enum: ["image"], required: true },
  width: Number,
  height: Number,
});

const VideoAttachmentSchema = new mongoose.Schema({
  ...AttachmentBaseSchema.obj,
  type: { type: String, enum: ["video"], required: true },
  duration: Number,
  width: Number,
  height: Number,
});

const AudioAttachmentSchema = new mongoose.Schema({
  ...AttachmentBaseSchema.obj,
  type: { type: String, enum: ["audio"], required: true },
  duration: Number,
  bitrate: Number,
});

const DocumentAttachmentSchema = new mongoose.Schema({
  ...AttachmentBaseSchema.obj,
  type: { type: String, enum: ["document"], required: true },
  pages: Number,
});

const AttachmentSchema = new mongoose.Schema({
  type: { type: String, enum: ["image", "video", "audio", "document"], required: true },
  url: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  name: { type: String, required: true },
  createdAt: { type: String, required: true },
  fileId: { type: String, required: true },
  width: Number,
  height: Number,
  duration: Number,
  bitrate: Number,
  pages: Number,
});

const BaseMessageSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  tempId: String,
  conversationId: { type: String, required: true },
  senderId: { type: String, required: true },
  receiverId: String,
  status: { 
    type: String, 
    enum: ["sending", "sent", "delivered", "read", "failed"], 
    default: "sent" 
  },
  replyTo: String,
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
});

const MessageSchema = new mongoose.Schema({
  ...BaseMessageSchema.obj,
  type: { 
    type: String, 
    enum: ["default", "gif"], 
    required: true 
  },
  text: String,
  attachments: [AttachmentSchema],
  gif: {
    url: { type: String, required: true },
    name: { type: String, required: true },
  },
}, { timestamps: true });

const Message = mongoose.model("message", MessageSchema);

export default Message;