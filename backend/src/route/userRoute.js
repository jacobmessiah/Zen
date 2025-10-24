import express from "express";
import ProtectRoute from '../middleware/protectUser.js'
import {
  checkEmail,
  checkUser,
  handleGoogleAuth,
  handleResend,
  login,
  logout,
  Register,
  searchUsername,
  verify,
} from "../controller/userController.js";

const userRoute = express.Router();


userRoute.post("/register", Register);
userRoute.post("/verify", verify);
userRoute.post("/login", login);
userRoute.post("/logout", logout);
userRoute.get('/check' ,ProtectRoute, checkUser)
userRoute.post('/find/username', searchUsername)//For when a user wants to create an account or wants to change username 
userRoute.post('/confirm/resend', handleResend)
userRoute.post('/check/email' ,checkEmail)

userRoute.post('/google' , handleGoogleAuth)

export default userRoute;
