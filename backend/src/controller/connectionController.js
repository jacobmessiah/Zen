import { getUserSocket, io } from "../lib/io.js";
import ConnectionPing from "../model/connectionPingModel.js";
import User from "../model/userModel.js";

export const HandleNewConnection = async (req, res) => {
  try {
    const pingArg = req.body.pingArg;
    const user = req.user;

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

    //Alert Notice //  Add Check for max connections here max is 200

    const newConnectionPing = await ConnectionPing.create({
      from: user._id,
      to: findUser._id,
      showFor: [findUser._id, user._id],
      isMessageRequest: false,
    });

    const populatedPing = await newConnectionPing.populate("to");
    const userSocketID = getUserSocket(findUser._id.toString());

    if (userSocketID) {
      io.to(userSocketID).emit("newConnectionPing", populatedPing);
    }

    console.log(
      `New ConnectionPing Created by ${user._id}. Ping id --> ${newConnectionPing._id}`
    );

    return res.status(201).json({
      message: "CONNECTION_PING_CREATED",
      pingData: newConnectionPing,
    });
  } catch (error) {
    console.log(
      "Error on #HandleNewConnection #connectionController.js",
      error?.message || error
    );
    return res.status(500).json({ message: "SERVER_ERROR" });
  }
};
