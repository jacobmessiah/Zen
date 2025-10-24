import express from "express";
import {
  addFriend,
  getFriends,
  getRequests,
  acceptReq,
  getPending,
  deletePending,
  rejectReq,
  removeFriend,
} from "../controller/friendController.js";
import ProtectRoute from "../middleware/protectUser.js";

const friendRoute = express.Router();

friendRoute.get("/get", ProtectRoute, getFriends);
friendRoute.post("/add", ProtectRoute, addFriend);

friendRoute.post("/accept", ProtectRoute, acceptReq);
friendRoute.get("/all/pending", ProtectRoute, getPending);
friendRoute.post("/delete/pending", ProtectRoute, deletePending);
friendRoute.post("/reject/request", ProtectRoute, rejectReq);
friendRoute.get("/all/request", ProtectRoute, getRequests);
friendRoute.post("/remove", ProtectRoute, removeFriend);

export default friendRoute;
