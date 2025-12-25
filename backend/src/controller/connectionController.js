import ConnectionPing from "../model/connectionPingModel.js";
import User from "../model/userModel.js";

export const HandleNewConnection = async (req, res) => {
  try {
    const pingArg = req.body.pingArg;

    if (!pingArg)
      return res.status(400).json({ message: "ERROR_MISSING_PING_ARG" });

    const findUser = await User.findOne({ username: pingArg });

    if (!findUser) return res.status(404).json({ message: "USER_NOT_FOUND" });
    const user = req.user;

    const existingConnectionPing = await ConnectionPing.findOne({
      to: findUser._id,
    });

    if (existingConnectionPing)
      return res.status(400).json({ message: "PING_ALREADY_SENT" });

    const newConnectionPing = await ConnectionPing.create({
      from: user._id,
      to: findUser._id,
      showFor: [findUser._id, user._id],
      isMessageRequest: false,
    });

    console.log("New Connection Ping Created:", newConnectionPing);

    return res
      .status(201)
      .json({ message: "CONNECTION_PING_CREATED", data: newConnectionPing });
  } catch (error) {
    console.log(
      "Error on #HandleNewConnection #connectionController.js",
      error?.message || error
    );
    return res.status(500).json({ message: "SERVER_ERROR" });
  }
};
