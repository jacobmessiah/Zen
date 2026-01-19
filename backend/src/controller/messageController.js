import Message from "../model/messageModel.js";
import Conversation from "../model/conversationModel.js";
import imageKitInstance from "../lib/kitUploader.js";
import { emitPayLoadToUser } from "../lib/io.js";

export const DOCUMENT_MIME_TYPES = [
  "application/pdf", // PDF
  "application/msword", // Word DOC
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Word DOCX
  "application/vnd.ms-excel", // Excel XLS
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel XLSX
  "application/vnd.ms-powerpoint", // PowerPoint PPT
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PowerPoint PPTX
  "text/plain", // TXT
];

export const IMAGE_MIME_TYPES = [
  "image/jpeg", // JPG / JPEG
  "image/png", // PNG
  "image/webp", // WebP
  "image/gif", // GIF
  "image/avif", // AVIF
];

export const VIDEO_MIME_TYPES = [
  "video/mp4", // MP4
  "video/webm", // WebM
  "video/ogg", // OGG
  "video/quicktime", // MOV
];

export const handleSendMessage = async (req, res) => {
  try {
    const user = req.user;

    if (!req.body) {
      return res.status(400).json({ message: "NO_PARAMS" });
    }

    const { conversationId, receiverId, replyTo, tempId, text } =
      req.body || {};

    if (!text && typeof text !== "string") {
      return res.status(400).json({ message: "NO_PARAMS" });
    }

    if (!conversationId || !receiverId) {
      return res.status(400).json({ message: "NO_DESTINATION" });
    }

    const convo =
      await Conversation.findById(conversationId).populate("connectionId");

    if (!convo || !convo.connectionId) {
      return res.status(400).json({ message: "NOT_CONNECTED" });
    }

    const newMessage = await Message.create({
      senderId: user._id,
      receiverId,
      conversationId,
      type: "text",
      text: text,
    });

    const returnObject = {
      ...newMessage.toObject(),
      tempId: tempId,
    };

    const currentUnreadCount = convo.unreadCount || {};
    const otherUnreadCounts = currentUnreadCount[receiverId] || 0;
    await convo.updateOne({
      $set: {
        [`unreadCount.${user._id}`]: 0,
        [`unreadCount.${receiverId}`]: otherUnreadCounts + 1,
      },
      $addToSet: {
        showFor: { $each: [user._id, receiverId] },
      },
    });

    emitPayLoadToUser(receiverId, "EVENT:ADD", {
      type: "RECEIVE_MESSAGE",
      message: newMessage,
    });

    return res.status(200).json(returnObject);
  } catch (error) {
    console.log("Error on handleSendMessage", error);
    return res.status(500).json({ message: "SERVER_ERROR" });
  }
};

export const handleSendMediaTypeMessage = async (req, res) => {
  try {
    const user = req.user;

    // Note add switching when space setup is finalized
    const { conversationId, receiverId, replyTo, tempId, caption } =
      req.body || {};

    if (!req.body) {
      return res.status(400).json({ message: "NO_PARAMS" });
    }

    if (!conversationId || !receiverId) {
      return res.status(400).json({ message: "NO_DESTINATION" });
    }

    const convo =
      await Conversation.findById(conversationId).populate("connectionId");

    if (!convo || !convo.connectionId) {
      return res.status(400).json({ message: "NOT_CONNECTED" });
    }

    const files = req.files;

    if (!files || !Array.isArray(files) || files.length < 1) {
      return res.status(400).json({ message: "NO_PARAMS" });
    }

    const newMessageOBJ = {
      receiverId,
      conversationId,
      senderId: user._id,
      type: "media",
    };

    if (caption) {
      newMessageOBJ.caption = caption;
    }
    const uploadedMedia = await Promise.all(
      files.map(async (file) => {
        const uploadRes = await imageKitInstance.upload({
          file: file.buffer,
          fileName: file.originalname,
          folder: "/zen/chat/attachment/media",
        });

        const kind = IMAGE_MIME_TYPES.includes(file.mimetype)
          ? "image"
          : VIDEO_MIME_TYPES.includes(file.mimetype)
            ? "video"
            : "other";

        return {
          fileId: uploadRes.fileId,
          filePath: uploadRes.filePath,
          fileSize: uploadRes.size,
          fileName: uploadRes.name || file.originalname,
          kind,
          mimeType: file.mimetype,
          ...(uploadRes.thumbnailUrl && {
            thumbnailUrl: uploadRes.thumbnailUrl,
          }),
        };
      }),
    );

    const newMessage = await Message.create({
      ...newMessageOBJ,
      media: uploadedMedia,
    });

    console.log("New Message Created with Media Attached");

    const returnObject = {
      ...newMessage.toObject(),
      tempId: tempId,
    };

    const currentUnreadCount = convo.unreadCount || {};
    const otherUnreadCounts = currentUnreadCount[receiverId] || 0;
    await convo.updateOne({
      $set: {
        [`unreadCount.${user._id}`]: 0,
        [`unreadCount.${receiverId}`]: otherUnreadCounts + 1,
      },
      $addToSet: {
        showFor: { $each: [user._id, receiverId] },
      },
    });
    emitPayLoadToUser(receiverId, "EVENT:ADD", {
      type: "RECEIVE_MESSAGE",
      message: newMessage,
    });

    return res.status(200).json(returnObject);
  } catch (error) {
    console.log(
      "Error on #handleSendMediaTypeMessage  #messageController.js ERROR -->  ",
      error?.message || error,
    );
  }
};

export const handleSendDocumentTypeMessage = async (req, res) => {
  try {
    const user = req.user;

    // Note add switching when space setup is finalized
    const { conversationId, receiverId, replyTo, tempId, text } =
      req.body || {};

    if (!req.body) {
      return res.status(400).json({ message: "NO_PARAMS" });
    }
    if (!conversationId || !receiverId) {
      return res.status(400).json({ message: "NO_DESTINATION" });
    }
    const convo =
      await Conversation.findById(conversationId).populate("connectionId");
    if (!convo || !convo.connectionId) {
      return res.status(400).json({ message: "NOT_CONNECTED" });
    }
    const file = req.file;
    const { buffer, ...rest } = file;
    if (!file || !file.buffer) {
      return res.status(400).json({ message: "NO_PARAMS" });
    }

    const uploadRes = await imageKitInstance.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "/zen/chat/attachment/documents",
    });

    const documentObject = {
      fileName: file?.originalname || "Document",
      mimeType: file.mimetype,
      fileId: uploadRes.fileId,
      mimeType: file.mimetype,
      fileSize: file.size,
      url: uploadRes.url,
    };

    const newMessageOBJ = {
      receiverId,
      conversationId,
      senderId: user._id,
      type: "document",
    };

    if (text) {
      newMessageOBJ.caption = text;
    }

    const newMessage = await Message.create({
      ...newMessageOBJ,
      document: documentObject,
    });

    console.log("New Message Created with Document Attached");

    const returnObject = {
      ...newMessage.toObject(),
      tempId: tempId,
    };

    const currentUnreadCount = convo.unreadCount || {};
    const otherUnreadCounts = currentUnreadCount[receiverId] || 0;
    await convo.updateOne({
      $set: {
        [`unreadCount.${user._id}`]: 0,
        [`unreadCount.${receiverId}`]: otherUnreadCounts + 1,
      },
      $addToSet: {
        showFor: { $each: [user._id, receiverId] },
      },
    });

    emitPayLoadToUser(receiverId, "EVENT:ADD", {
      type: "RECEIVE_MESSAGE",
      message: newMessage,
    });

    return res.status(200).json(returnObject);
  } catch (error) {
    console.log(
      "Error on #handleSendMediaTypeMessage  #messageController.js ERROR -->  ",
      error?.message || error,
    );
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
