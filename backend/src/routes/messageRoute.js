import { Router } from "express";
import {
  handleGetAllMessages,
  handleSendDocumentTypeMessage,
  handleSendMediaTypeMessage,
  handleSendMessage,
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

const limits = {
  fileSize: 10 * 1024 * 1024, // 10 MB max per file
};

const upload = multer({ storage, fileFilter, limits });

messageRoute.post(
  "/send/media",
  ProtectRoute,
  upload.array("attachments", 30),
  handleSendMediaTypeMessage,
);

messageRoute.post("/send/text", ProtectRoute, handleSendMessage);

messageRoute.post(
  "/send/document",
  ProtectRoute,
  upload.single("document"),
  handleSendDocumentTypeMessage,
);

messageRoute.get(
  "/get/all/:conversationId",
  ProtectRoute,
  handleGetAllMessages,
);

export default messageRoute;
