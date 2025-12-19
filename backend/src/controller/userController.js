import User from "../model/userModel.js";
import Confirmation from "../model/ComfirmationModel.js";
import GenCode from "../lib/genCode.js";
import { transport } from "../lib/mailer.js";
import confirmationPage from "../page/comfirmationPage.js";
import bcrypt from "bcryptjs";
import generateJwtToken from "../lib/utils.js";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import generateUniqueUsername from "../lib/generateUsername.js";
import Friend from "../model/friendModel.js";
import mongoose from "mongoose";

export const Register = async (req, res) => {
  try {
    const { name, password } = req.body;
    const username = req.body.username.trim().toLowerCase();
    const email = req.body?.email?.trim()?.toLowerCase();

    if (!name)
      return res.status(400).json({ message: "Full Name is required" });
    if (!username)
      return res.status(400).json({ message: "Username is required" });
    if (!password)
      return res.status(400).json({ message: "Password is required" });
    if (!password.length > 7)
      return res
        .status(400)
        .json({ message: "Password must be atleast 8 characters" });
    if (!email) return res.status(400).json({ message: "Email is Required" });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid Email" });

    const user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (user)
      return res
        .status(400)
        .json({ message: "Email or Username Already Exists" });

    const pending = await Confirmation.findOne({ email: email });
    if (pending?.attempts > 4)
      return res.status(400).json({ message: "Too many Requests" });
    if (pending) {
      await pending.deleteOne();
    }

    const hashedPassword = await bcrypt.hash(password, 10);
  } catch (error) {
    console.log("Error on #signup #userController", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const password = req.body.password;
    const handle = req.body.handle?.trim().toLowerCase();

    if (!handle)
      return res
        .status(400)
        .json({ message: "Username or Email is required to login" });
    if (!password)
      return res.status(400).json({ message: "Password is Required to login" });
    const user = await User.findOne({
      $or: [{ username: handle }, { email: handle }],
    });

    if (!user) return res.status(400).json({ message: "Invalid Credentials" });
    if (user.loginType !== "email")
      return res
        .status(400)
        .json({ message: "Try another login method for your account" });

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword)
      return res.status(400).json({ message: "Invalid Credentials" });

    generateJwtToken(user._id, res);
    res.status(200).json({ message: `You are Logged in as ${user.username}` });
  } catch (error) {
    console.log("Error on Login #userController.js", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("ZenChattyVerb", "", {
      maxAge: 0,
      sameSite: "Strict",
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    });
    res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    console.log("Error on Logout Controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkUser = (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    console.log("Error on #check #userController.js", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
