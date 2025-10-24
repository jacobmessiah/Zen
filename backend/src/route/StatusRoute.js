import { Router } from "express";
import {
  createStatus,
  getFriendStatus,
  getMyStatus,
} from "../controller/StatusController.js";
import ProtectRoute from "../middleware/protectUser.js";

const StatusRoute = Router();

StatusRoute.post("/add", ProtectRoute, createStatus);
StatusRoute.get("/all/me", ProtectRoute, getMyStatus);
StatusRoute.get("/all/friends", ProtectRoute, getFriendStatus);

export default StatusRoute;
