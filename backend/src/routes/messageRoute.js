import { Router } from "express";
import {
  handleForwardMessage,
  handleGetAllMessages,
  handleSendMessage,
  handleUploadAttachment,
} from "../controller/messageController.js";
import multer from "multer";
import ProtectRoute from "../middleware/protectUser.js";

const messageRoute = Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ALL_MIME_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "audio/wav",
    "audio/ogg",
    "audio/webm",
    "audio/flac",
    "audio/aac",
    "audio/mp4",
    "audio/mpeg",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
  ];

  if (ALL_MIME_TYPES.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Unsupported file type"), false);
};

const MAX_ATTACHMENT = 10;

const limits = {
  fileSize: 11 * 1024 * 1024,
};

const upload = multer({ storage, fileFilter, limits });

messageRoute.post(
  "/upload/attachments",
  upload.fields([
    {
      name: "attachment",
      maxCount: MAX_ATTACHMENT,
    },
  ]),
  ProtectRoute,
  handleUploadAttachment,
);

messageRoute.get(
  "/get/all/:conversationId",
  ProtectRoute,
  handleGetAllMessages,
);

messageRoute.post("/send", ProtectRoute, handleSendMessage);
messageRoute.post("/forward", ProtectRoute, handleForwardMessage);

export default messageRoute;
