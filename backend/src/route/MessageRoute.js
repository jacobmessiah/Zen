import express from "express";
import ProtectUser from "../middleware/protectUser.js";
import { getMessage, SendMessage } from "../controller/MessageController.js";
const MessageRoute = express.Router();

MessageRoute.get("/get/:convoId", ProtectUser, getMessage);
MessageRoute.post("/send", ProtectUser, SendMessage);

export default MessageRoute;
