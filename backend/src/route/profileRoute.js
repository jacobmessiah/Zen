import express from "express";
import {
  changeUsername,
  getUser,
  updateProfile,
} from "../controller/profileController.js";
import ProtectRoute from "../middleware/protectUser.js";
const profileRoute = express.Router();

profileRoute.post("/user", getUser);
profileRoute.post("/update/username", ProtectRoute, changeUsername);
profileRoute.patch("/update", ProtectRoute, updateProfile);

export default profileRoute;
