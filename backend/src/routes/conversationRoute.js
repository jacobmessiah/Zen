import { Router } from "express";
import ProtectRoute from "../middleware/protectUser.js";
import {
  handleCreateNewConversation,
  handleGetConversation,
} from "../controller/conversationController.js";

const conversationRoute = Router();

conversationRoute.get("/get/:conversationId", ProtectRoute, handleGetConversation);
conversationRoute.post("/create", ProtectRoute, handleCreateNewConversation);

export default conversationRoute;
