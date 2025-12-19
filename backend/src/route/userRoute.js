import express from "express";
import ProtectRoute from "../middleware/protectUser.js";
import {
  checkUser,
  login,
  logout,
  Register,
} from "../controller/userController.js";

const userRoute = express.Router();

userRoute.post("/register", Register);
userRoute.post("/login", login);
userRoute.post("/logout", logout);
userRoute.get("/check", ProtectRoute, checkUser);


export default userRoute;
