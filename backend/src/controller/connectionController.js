import { emitPayloadToOtherSessions, emitPayLoadToUser } from "../lib/io.js";
import Connection from "../model/connectionModel.js";
import ConnectionPing from "../model/connectionPingModel.js";
import User from "../model/userModel.js";

export const handleNewConnectionPing = async (req, res) => {
  try {
    const pingArg = req.body.pingArg;
    const user = req.user;
    const session = req.session;

    if (!user) return res.status(400).json({ message: "UNAUTHORIZED" });

    if (!pingArg)
      return res.status(400).json({ message: "ERROR_MISSING_PING_ARG" });

    const findUser = await User.findOne({ username: pingArg });

    if (!findUser) return res.status(404).json({ message: "USER_NOT_FOUND" });

    if (findUser._id.equals(user._id)) {
      return res.status(400).json({ message: "CANNOT_CONNECT_TO_YOURSELF" });
    }

    const existingConnectionPing = await ConnectionPing.findOne({
      from: user._id,
      to: findUser._id,
    });

    if (existingConnectionPing) {
      return res.status(400).json({ message: "PING_ALREADY_SENT" });
    }

    const existingReceivedPing = await ConnectionPing.findOne({
      from: findUser._id,
      to: user._id,
    });

    if (existingReceivedPing) {
      return res.status(400).json({ message: "PING_ALREADY_RECEIVED" });
    }

    //Alert Notice //  Add Check for max connections here max is 200

    const newConnectionPing = await ConnectionPing.create({
      from: user._id,
      to: findUser._id,
      showFor: [findUser._id, user._id],
      isMessageRequest: false,
    });

    const populatedTo = await newConnectionPing.populate("to");
    const populatedFrom = await newConnectionPing.populate("from");

    emitPayLoadToUser(findUser._id, "newConnectionPing", populatedFrom);
    emitPayloadToOtherSessions(
      user._id,
      "SYNC:ADD",
      {
        type: "ADD_SENT_PING",
        connectionPing: populatedTo,
      },
      session._id
    );

    console.log(
      `New ConnectionPing Created by ${user._id}. Ping id --> ${newConnectionPing._id}`
    );

    return res.status(201).json({
      message: "CONNECTION_PING_CREATED",
      pingData: populatedTo,
    });
  } catch (error) {
    console.log(
      "Error on #HandleNewConnection #connectionController.js",
      error?.message || error
    );
    return res.status(500).json({ message: "SERVER_ERROR" });
  }
};

//Deletes a ping sent to a user. ie. a connection request
export const handleDeleteSentPendingPing = async (req, res) => {
  try {
    const { documentId } = req?.query || {};

    const user = req.user;
    const session = req.session;

    if (!documentId)
      return res.status(400).json({ message: "INVALID_REQUEST" });

    const connectionPingDoc = await ConnectionPing.findOne({ _id: documentId });
    if (!connectionPingDoc)
      return res.status(400).json({ message: "DOES_NOT_EXIST" });

    const deleteConnectionPing = await ConnectionPing.findOneAndDelete({
      _id: documentId,
    });

    console.log(
      `ConnectionPing Document Deleted. Document ID --> ${deleteConnectionPing._id}`
    );

    ///Emit to receiver of the connectionPing and update ui
    if (connectionPingDoc.showFor.includes(connectionPingDoc.to)) {
      emitPayLoadToUser(connectionPingDoc.to, "SYNC:REMOVE", {
        type: "REMOVE_RECEIVED_PING",
        documentId: documentId,
      });
    }

    //emit to user other devices connected if any
    emitPayloadToOtherSessions(
      user._id,
      "SYNC:REMOVE",
      {
        type: "REMOVE_SENT_PING",
        documentId: documentId,
      },
      session._id
    );

    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ message: "SERVER_ERROR" });
  }
};

export const handleAcceptConnectionPing = async (req, res) => {
  try {
    const documentId = req.body.documentId;

    const session = req.session;
    const user = req.user;

    if (!documentId)
      return res.status(400).json({ message: "DOCUMENT_ID_REQUIRED" });

    const findPing = await ConnectionPing.findOne({ _id: documentId });

    if (!findPing) return res.status(400).json({ message: "PING_NOT_FOUND" });

    const isSender = findPing.from.toString() === user._id.toString();

    const otherField = isSender ? "to" : "from";

    const newConnection = await Connection.create({
      senderId: findPing.from,
      receiverId: findPing.to,
    });

    const populateOtherField = await findPing.populate(otherField);
    const otherUser = populateOtherField[otherField];

    const { senderId, receiverId, ...rest } = newConnection.toObject();

    const returnObject = {
      ...rest,
      otherUser: otherUser,
    };

    const pairedWihReturnObject = {
      ...rest,
      otherUser: user,
    };

    emitPayloadToOtherSessions(
      user._id.toString(),
      "SYNC:ADD",
      {
        type: "ADD_CONNECTION",
        connectionData: returnObject,
        documentId: findPing?._id?.toString() || documentId,
      },
      session._id.toString()
    );
    await findPing.deleteOne();

    res.status(200).json({ connectionData: returnObject });
  } catch (error) {
    console.log(
      "Error on #acceptConnectionPing #connectionController.js  error  -->",
      error.message
    );

    if (error.code === 11000) {
      return res.status(400).json({ message: "CONNECTION_ALREADY_EXISTS" });
    }

    return res.status(500).json({ message: "SERVER_ERROR" });
  }
};

export const handleIgnoreConnectionPing = async (req, res) => {
  try {
    const user = req.user;
    const session = req.session;

    const documentId = req.body.documentId;

    if (!documentId) return res.status(400).json({ message: "WRONG_REQUEST" });

    const updateShow = await ConnectionPing.findByIdAndUpdate(
      documentId,
      { $pull: { showFor: user._id } },
      { new: true }
    );

    emitPayloadToOtherSessions(
      user._id.toString(),
      "SYNC:REMOVE",
      {
        type: "REMOVE_RECEIVED_PING",
        documentId: documentId,
      },
      session._id.toString()
    );

    return res.status(204).end();
  } catch (error) {
    console.log(
      "Error on  #handleIgnoreConnectionPing #connectionController.js",
      error.message || error
    );

    return res.status(500).json({ message: "SERVER_ERROR" });
  }
};
