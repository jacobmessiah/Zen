import Message from "../model/messageModel.js";
import Conversation from "../model/conversationModel.js";
import imageKitInstance from "../lib/kitUploader.js";
import { emitPayloadToOtherSessions, emitPayLoadToUser } from "../lib/io.js";
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

    const {
      attachments,
      receiverId,
      conversationId,
      text,
      replyTo,
      type,
      gif,
    } = req.body || {};

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

    const isTextEmpty = !text || text.trim().length === 0;
    const isAttachmentsEmpty =
      !attachments || (Array.isArray(attachments) && attachments.length === 0);

    if (isTextEmpty && isAttachmentsEmpty) {
      return res.status(400).json({ message: "NO_CONTENT" });
    }

    const messageOBJ = {
      senderId: user._id,
      receiverId,
      conversationId,
    };

    if (replyTo && typeof replyTo === "string") {
      messageOBJ.replyTo = replyTo;
      messageOBJ["isReplied"] = true;
    }

    if (type === "default") {
      if (text && typeof text == "string") {
        messageOBJ.text = text.trim();
      }

      if (attachments && Array.isArray(attachments) && attachments.length > 0) {
        if (
          attachments &&
          Array.isArray(attachments) &&
          attachments.length > 0
        ) {
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
    }

    if (type === "gif") {
      const requiredGifFields = ["id", "full", "preview"];
      const missingFields = requiredGifFields.filter((field) => !gif?.[field]);

      if (!gif || missingFields.length > 0) {
        return res.status(400).json({
          message: "INVALID_ARGS_RECEIVED_FOR_GIF",
          missingFields: missingFields.length > 0 ? missingFields : undefined,
        });
      }

      messageOBJ.type = "gif";
      messageOBJ.gif = {
        id: gif.id,
        full: gif.full,
        preview: gif.preview,
        width: gif.width || 0,
        height: gif.height || 0,
      };
    }

    const newMessage = await Message.create({
      ...messageOBJ,
    });

    let messageReturnObject;

    if (replyTo && typeof replyTo === "string") {
      messageReturnObject = (await newMessage.populate("replyTo")).toObject();
    } else {
      messageReturnObject = newMessage.toObject();
    }

    emitPayLoadToUser(receiverId, "EVENT:ADD", {
      type: "RECEIVE_MESSAGE",
      message: messageReturnObject,
    });

    return res.status(200).json(messageReturnObject);
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
      .sort({ createdAt: 1 })
      .limit(100)
      .populate("replyTo");

    return res.status(200).json(messages);
  } catch (error) {
    console.log(
      "Error on #handleGetAllMessage  #messageCotroller.js error -->",
      error,
    );
    return res.status(500).json({ message: "SERVER_ERROR" });
  }
};

export const handleForwardMessage = async (req, res) => {
  try {
    const { conversationIds, messageContent } = req.body || {};

    const user = req.user;

    const { type, text, attachments, gif } = messageContent || {};

    if (!type || !["default", "gif"].includes(type)) {
      return res.status(400).json({ message: "INVALID_MESSAGE_TYPE" });
    }

    if (type === "default") {
      const hasText =
        text && typeof text === "string" && text.trim().length > 0;
      const hasAttachments =
        attachments && Array.isArray(attachments) && attachments.length > 0;

      if (!hasText && !hasAttachments) {
        return res
          .status(400)
          .json({ message: "DEFAULT_MESSAGE_REQUIRES_TEXT_OR_ATTACHMENTS" });
      }

      if (hasAttachments) {
        for (const attachment of attachments) {
          if (!attachment.filePath || typeof attachment.filePath !== "string") {
            return res
              .status(400)
              .json({ message: "INVALID_ATTACHMENT_FILEPATH" });
          }
          if (!attachment.name || typeof attachment.name !== "string") {
            return res.status(400).json({ message: "INVALID_ATTACHMENT_NAME" });
          }
          if (
            !attachment.size ||
            typeof attachment.size !== "number" ||
            attachment.size <= 0
          ) {
            return res.status(400).json({ message: "INVALID_ATTACHMENT_SIZE" });
          }
          if (!attachment.fileId || typeof attachment.fileId !== "string") {
            return res
              .status(400)
              .json({ message: "INVALID_ATTACHMENT_FILEID" });
          }
        }
      }
    }

    if (type === "gif") {
      if (!gifData || typeof gif !== "object") {
        return res
          .status(400)
          .json({ message: "GIF_MESSAGE_REQUIRES_GIF_DATA" });
      }

      if (!gif.full || typeof gif.full !== "string") {
        return res.status(400).json({ message: "INVALID_GIF_FULL" });
      }
      if (!gif.preview || typeof gif.preview !== "string") {
        return res.status(400).json({ message: "INVALID_GIF_PREVIEW" });
      }
    }

    if (
      !conversationIds ||
      !Array.isArray(conversationIds) ||
      conversationIds.length < 1
    ) {
      return res.status(400).json({ message: "NO_DESTINATION" });
    }

    const conversations = await Conversation.find({
      _id: { $in: conversationIds },
    });

    if (
      !conversations ||
      !Array.isArray(conversations) ||
      conversations.length < 1
    ) {
      return res.status(400).json({ message: "NO_DESTINATION" });
    }

    const baseMessageObj = {
      isForwarded: true,
    };

    if (text) {
      baseMessageObj.text = text;
    }

    if (attachments) {
      baseMessageObj.attachments = attachments;
    }

    if (gif) {
      baseMessageObj.gif = gif;
    }

    const messageData = conversations.map((convo) => {
      const receiverId = convo.participants.find(
        (p) => p.toString() !== user._id.toString(),
      );

      return {
        ...baseMessageObj,
        senderId: user._id,
        receiverId,
        type,
        conversationId: convo._id,
      };
    });

    // Create all messages in one DB call
    const newMessages = await Message.insertMany(messageData);

    const returnData = newMessages.map((msg) => ({
      conversationId: msg.conversationId,
    }));

    return res.status(200).json({ message: "success", data: returnData });
  } catch (error) {
    console.log(
      "Error on handleForwardMessage error ---> ",
      error?.message || error,
    );

    return res.status(500).json({ message: "SERVER_ERROR" });
  }
};

export const handleDeleteMessage = async (req, res) => {
  try {
    const user = req.user;
    const session = req.session;

    const { convoId, messageId } = req?.query || {};

    if (!convoId || !messageId)
      return res.status(400).json({ message: "NO_TARGET" });

    if (typeof convoId !== "string" || typeof messageId !== "string") {
      return res.status(400).json({ message: "INVALID_PAYLOAD" });
    }

    const findConvo = await Conversation.findOne({ _id: convoId });

    if (!findConvo) return res.status(400).json({ message: "NO_DESTINATION" });

    const findUserInConvo = findConvo.participants.find((p) =>
      p.equals(user._id),
    );

    const otherUserId = findConvo.participants.find((p) => !p.equals(user._id));

    if (!findUserInConvo) {
      return res.status(400).json({ message: "NO_OWNERSHIP" });
    }

    const findMessage = await Message.findOne({ _id: messageId });

    if (!findMessage) {
      return res.status(400).json({ message: "NO_TARGET" });
    }

    if (findMessage.attachments && findMessage.attachments.length > 0) {
      const messagesWithSameAttachments = await Message.find({
        _id: { $ne: messageId }, // Exclude the message we're deleting
        $or: [
          {
            "attachments.fileId": {
              $in: findMessage.attachments.map((a) => a.fileId),
            },
          },
          {
            "attachments.filePath": {
              $in: findMessage.attachments.map((a) => a.filePath),
            },
          },
        ],
      });

      // Check if attachments are used elsewhere
      const hasSharedAttachments = messagesWithSameAttachments.length > 0;

      if (!hasSharedAttachments) {
        const fileIds = [];
        findMessage.attachments.forEach((t) => {
          fileIds.push(t.fileId);
        });

        try {
          const deleteRes = await imageKitInstance.bulkDeleteFiles(fileIds);
          console.log({
            message: "Bulk Deleted files",
            ids: fileIds,
            successfullyDeletedFileIds: deleteRes.successfullyDeletedFileIds,
          });
        } catch (error) {
          console.log(
            "Failed to Delete Files Error --> ",
            error.message || error,
          );
        }
      }
    }

    await findMessage.deleteOne();

    if (otherUserId) {
      emitPayLoadToUser(otherUserId, "EVENT:REMOVE", {
        type: "DELETE_MESSAGE",
        conversationId: findConvo._id,
        messageId: findMessage._id,
      });
    }

    emitPayloadToOtherSessions(
      user._id,
      "SYNC:REMOVE",
      {
        type: "DELETE_MESSAGE",
        conversationId: findConvo._id,
        messageId: findMessage._id,
      },
      session._id,
    );

    return res.status(204).end();
  } catch (error) {
    console.log(
      "Error on handleDeleteMessage Errror message -->",
      error?.message || error,
    );
  }
};
