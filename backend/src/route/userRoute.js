import express from "express";
import ProtectRoute from "../middleware/protectUser.js";
import {
  checkUser,
  handleLogin,
  handleLogout,
  handleSignup,
} from "../controller/userController.js";

const userRoute = express.Router();

userRoute.post("/signup", handleSignup);
userRoute.post("/login", handleLogin);
userRoute.post("/logout", handleLogout);
userRoute.get("/check", ProtectRoute, checkUser);

export default userRoute;
