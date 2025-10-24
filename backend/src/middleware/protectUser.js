import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

const ProtectRoute = async (req, res, next) => {
  try {
    const cookie = req.cookies.ZenChattyVerb;
    if (!cookie) return res.status(400).json({ message: "No Cookies Found" });

    const verify = await jwt.verify(cookie, process.env.JWT_SECRET);
    if (!verify)
      return res
        .status(400)
        .json({ message: "Request rejected - unauthorized" });

    const decode = jwt.decode(cookie);
    if (!decode) return res.status(400).json({ message: "User not found" });
    const user = await User.findOne({ _id: decode.userId }).select("-password");
    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid Cookie - Request Declined" });

    req.user = user;
    next();
  } catch (err) {
    console.log("Error on ProtectRoute", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default ProtectRoute;
