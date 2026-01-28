import Message from "../model/messageModel.js";
import Conversation from "../model/conversationModel.js";
import imageKitInstance from "../lib/kitUploader.js";
import { emitPayLoadToUser } from "../lib/io.js";
import unClaimedUpload from "../model/UnClaimedUploadModel.js";

export const DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain", // TXT
];

export const AUDIO_MIME_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/webm",
  "audio/flac",
  "audio/aac",
  "audio/mp4",
];

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

export const VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

const failedUploads = [];

const getAttachmentType = (mimeType) => {
  if (
    !mimeType ||
    typeof mimeType !== "string" ||
    mimeType.trim().length === 0
  ) {
    return null;
  }

  const normalized = mimeType.trim();

  if (DOCUMENT_MIME_TYPES.includes(normalized)) return "document";
  if (IMAGE_MIME_TYPES.includes(normalized)) return "image";
  if (VIDEO_MIME_TYPES.includes(normalized)) return "video";
  if (AUDIO_MIME_TYPES.includes(normalized)) return "audio";

  return null;
};

export const handleUploadAttachment = async (req, res) => {
  try {
    const files = req.files?.attachment || [];

    // For Simplicity. i will proceed to upload
    // Multer middleware already handles file validation and limits before this point 😏

    // Upload files to ImageKit
    /// For Simplicity, I will upload with all or nothing approach
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        try {
          const type = getAttachmentType(file.mimetype);

          if (!type) return null;

          const response = await imageKitInstance.upload({
            file: file.buffer,
            fileName: file.originalname,
            folder: "/zen/chat/attachments",
          });

          failedUploads.push(response.fileId);

          return {
            createdBy: req.user._id,
            fileId: response.fileId,
            filePath: response.filePath,
            name: response.name,
            size: file.size,
            type,
            mimeType: file.mimetype,
            canDeleteAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          };
        } catch (err) {
          console.error("Upload failed:", file.originalname, err);
          return null;
        }
      }),
    );

    const validUploads = uploadedFiles.filter(Boolean);

    if (validUploads.length === 0) {
      return res.status(400).json({ message: "NO_VALID_ATTACHMENTS" });
    }

    await unClaimedUpload.insertMany(validUploads);

    if (validUploads.length === 0) {
      return res.status(400).json({ message: "UPLOAD_FAILED" });
    }

    await unClaimedUpload.insertMany(uploadedFiles);

    const filteredUploads = uploadedFiles.map((upload) => {
      const { canDeleteAt, createdBy, ...rest } = upload || {};
      return rest;
    });

    return res.status(200).json(filteredUploads);
  } catch (error) {
    console.log(
      "Error on #handleUploadAttachment  #messageCotroller.js error -->",
      error?.message || error,
    );
    if (failedUploads.length > 0) {
      // Rollback uploaded files
      await Promise.all(
        failedUploads.map(async (fileId) => {
          await imageKitInstance.deleteFile(fileId);
        }),
      ).catch((err) => {
        console.log(
          "Error rolling back files in #handleUploadAttachment #messageController.js -->",
          err,
        );
      });
    }
    return res.status(500).json({ message: "SERVER_ERROR" });
  }
};

export const handleSendMessage = async (req, res) => {
  try {
    const user = req.user;

    const { attachments, receiverId, conversationId, text, replyTo, type } =
      req.body || {};

    if (
      !conversationId ||
      typeof conversationId !== "string" ||
      !receiverId ||
      typeof receiverId !== "string"
    ) {
      return res.status(400).json({ message: "NO_DESTINATION" });
    }

    // Note Expand type validation when message evolves
    if (
      !type ||
      typeof type !== "string" ||
      (type !== "default" && type !== "gif")
    ) {
      return res.status(400).json({ message: "INVALID_MESSAGE_TYPE" });
    }

    const messageOBJ = {
      senderId: user._id,
      receiverId,
      conversationId,
    };

    if (text && typeof text == "string") {
      messageOBJ.text = text.trim();
    }

    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      if (attachments && Array.isArray(attachments) && attachments.length > 0) {
        for (const att of attachments) {
          if (
            !att.fileId ||
            typeof att.fileId !== "string" ||
            !att.filePath ||
            typeof att.filePath !== "string" ||
            !att.mimeType ||
            typeof att.mimeType !== "string" ||
            !att.size ||
            typeof att.size !== "number" ||
            !att.name ||
            typeof att.name !== "string"
          ) {
            return res
              .status(400)
              .json({ message: "INVALID_ATTACHMENT_IN_LIST" });
          }
        }

        await Promise.all(
          attachments.map((att) =>
            unClaimedUpload.deleteOne({ fileId: att.fileId }),
          ),
        );

        messageOBJ.attachments = attachments;
      }

      messageOBJ.attachments = attachments;
    }

    const newMessage = await Message.create({
      ...messageOBJ,
    });

    emitPayLoadToUser(receiverId, "EVENT:ADD", {
      type: "RECEIVE_MESSAGE",
      message: newMessage.toObject(),
    });

    return res.status(200).json(newMessage.toObject());
  } catch (error) {
    console.log(
      "Error on #handleSendMessage #messageController.js Error --->",
      error,
    );

    return res.status(500).json({ message: "SERVER_ERROR" });
  }
};

export const handleGetAllMessages = async (req, res) => {
  try {
    const { conversationId } = req.params || {};

    if (!conversationId || typeof conversationId !== "string") {
      return res.status(400).json({ message: "INVALID_OR_NO_PARAMS" });
    }

    // //Alert Add Switch when space is defined
    // const conversation = await Conversation.findOne({
    //   _id: conversationId,
    // }).populate("connectionId");

    // if (!conversation || !conversation.connectionId) {
    //   return res.status(400).json({ message: "UNAUTHORIZED_FETCH" });
    // }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 }) // Oldest first
      .limit(100);

    return res.status(200).json(messages);
  } catch (error) {
    console.log(
      "Error on #handleGetAllMessage  #messageCotroller.js error -->",
      error,
    );
    return res.status(500).json({ message: "SERVER_ERROR" });
  }
};
