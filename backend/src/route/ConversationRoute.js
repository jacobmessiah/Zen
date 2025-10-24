import express from "express";
import {
  addConversation,
  getConversation,
  getConversations,
} from "../controller/ConversationController.js";
import ProtectRoute from "../middleware/protectUser.js";

const ConversationRoute = express.Router();

ConversationRoute.get("/all", ProtectRoute, getConversations);
ConversationRoute.post("/add", ProtectRoute, addConversation);
ConversationRoute.get("/get/:convoId", ProtectRoute, getConversation);

export default ConversationRoute;
