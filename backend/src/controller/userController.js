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
    const expires = new Date(Date.now() + 1000 * 60 * 60);
    const token = GenCode();
    const newPending = await Confirmation.create({
      code: token,
      username,
      email,
      name,
      password: hashedPassword,
      expiresAt: expires,
    });

    const info = await transport.sendMail({
      to: email,
      subject: `${token} is your 6 digit confirmation code`,
      text: "Enter your code to confirm your Zen Account",
      html: confirmationPage(token),
    });

    const [local, domain] = email.split("@");
    const visible = local.slice(0, 3);
    const hiddenLength = local.length - visible.length;
    const fillIn = "*".repeat(hiddenLength);
    const hiddenMail = `${visible}${fillIn}@${domain}`;
    if (info)
      return res.status(200).json({
        resendId: newPending._id,
        message: `Check ${hiddenMail} for Confirmation Code`,
      });
    if (!info) {
      const deleteConfirmation = await Confirmation.findOneAndDelete({
        email: email,
      });
      return res.status(400).json({
        message: "Confirmation email failed. check your email and Retry",
      });
    }
  } catch (error) {
    console.log("Error on #signup #userController", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verify = async (req, res) => {
  try {
    const code = req.body?.code?.trim();
    if (!code) return res.status(400).json({ message: "OTP Code required" });
    const checkConfirmation = await Confirmation.findOne({ code: code });
    if (!checkConfirmation)
      return res.status(400).json({ message: "Wrong or Expired Code" });

    const userExist = await User.findOne({ email: checkConfirmation.email });
    if (userExist)
      return res.status(400).json({ message: "Code Expired or Invalid" });

    const newUser = await User.create({
      email: checkConfirmation.email,
      name: checkConfirmation.name,
      password: checkConfirmation.password,
      username: checkConfirmation.username,
    });

    await checkConfirmation.deleteOne();
    generateJwtToken(newUser._id, res);
    res.status(200).json({ message: "Account Verified Successfully" });
  } catch (error) {
    console.error(error);
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

export const searchUsername = async (req, res) => {
  try {
    const username = req.body.username.trim().toLowerCase();

    if (!username)
      return res.status(500).json({ message: "What will you search with" });
    const checkusername = await User.findOne({ username: username });

    if (checkusername)
      return res.status(400).json({
        message: `Sorry ${checkusername.username} is taken pick something else`,
      });
    if (!checkusername)
      return res.status(200).json({ message: `${username} is available` });
  } catch (error) {
    console.log("Error on #checkUser #UserController.js", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleGoogleAuth = async (req, res) => {
  try {
    const code = req.body?.code;
    if (!code || code === "")
      return res
        .status(400)
        .json({ message: "code required for google Authentication" });

    const CLIENT_ID = process.env.ClIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;

    let googleRes;

    const data = new URLSearchParams();
    data.append("code", code);
    data.append("client_id", CLIENT_ID);
    data.append("client_secret", CLIENT_SECRET);
    data.append("redirect_uri", GOOGLE_REDIRECT_URL);
    data.append("grant_type", "authorization_code");

    try {
      googleRes = await axios.post(
        "https://oauth2.googleapis.com/token",
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
    } catch (error) {
      console.log(
        "Error on googleRes #handleGoogleAuth #usercontroller.js",
        error
      );
      return res.status(400).json({ message: "Authentication failed" });
    }

    if (!googleRes.data)
      return res.status(200).json({ message: "Authentication failed" });

    const { id_token } = googleRes.data;

    //Oauth2 inititate with client id
    const client = new OAuth2Client({
      client_id: CLIENT_ID,
    });

    //start verify and adding try catch to handle errors
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: CLIENT_ID,
      });
    } catch (error) {
      console.log(
        `Error on verifying token #handleGoogleAuth #usercontroller.js`
      );
      return res.status(400).json({ message: "Authentication Failed" });
    }

    const payload = await ticket.getPayload();
    const { email, name, sub } = payload;

    if (!email)
      return res.status(400).json({ message: "Authentication Failed" });
    if (!name)
      return res.status(400).json({ message: "Authentication Failed" });

    //checking if user exists. when true logs user in when false creates a new user and log user in

    const isUser = await User.findOne({ email: email, loginType: "google" });

    if (isUser) {
      console.log("UserExist");
      generateJwtToken(isUser._id, res);
      return res
        .status(200)
        .json({ message: `you are logged in as ${isUser.username}` });
    }

    if (!isUser || isUser === null) {
      console.log("New user created");
      const username = await generateUniqueUsername(name);
      const hashedPassword = await bcrypt.hash(sub, 10);
      const newUser = await User.create({
        name: name,
        username: username,
        password: hashedPassword,
        email: email,
        loginType: "google",
      });
      generateJwtToken(newUser._id, res);
      return res.status(200).json({ message: "Authentication successfull" });
    }

    return res.status(500).json({ message: "Failed" });
  } catch (error) {
    console.log("Error on handleGoogleAuth #usercontroller.js", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleResend = async (req, res) => {
  try {
    const objectId = req.body?.objectId;

    const newObject = new mongoose.Types.ObjectId(objectId);
    console.log(newObject);

    if (!objectId || objectId === "")
      return res
        .status(400)
        .json({ message: "Could not resend confirmation code" });

    const checkConfirmation = await Confirmation.findOne({ _id: newObject });
    if (!checkConfirmation)
      return res.status(400).json({
        message:
          "Resend failed, Confirmation expired. Try creating a new account ",
      });

    if (checkConfirmation.attempts > 4)
      return res.status(400).json({ message: "Too many Requests" });

    const attempts = checkConfirmation.attempts + 1;
    await checkConfirmation.deleteOne();

    const newCode = GenCode();
    const expires = new Date(Date.now() + 1000 * 60 * 60);

    const newConfirmation = await Confirmation.create({
      password: checkConfirmation.password,
      email: checkConfirmation.email,
      username: checkConfirmation.username,
      attempts: attempts,
      code: newCode,
      expiresAt: expires,
      name: checkConfirmation.name,
    });

    if (!newConfirmation)
      return res
        .status(400)
        .json({ message: "Could not resend confirmation code" });

    let info;

    try {
      info = await transport.sendMail({
        to: newConfirmation.email,
        subject: `${newCode} is your new Zen confirmation code `,
        html: confirmationPage(newCode),
        text: "Enter your code to confirm your Zen Account",
      });
    } catch (error) {
      await newConfirmation.deleteOne();
      console.log("Error sending email", error);
      return res
        .status(400)
        .json({ message: "Could not send confirmation code" });
    }

    if (!info.accepted) {
      return res.status(400).json({ message: "Message could not be sent" });
    }
    const [local, domain] = newConfirmation.email.split("@");
    const visible = local.slice(0, 3);
    const hiddenLength = local.length - visible.length;
    const fillIn = "*".repeat(hiddenLength);
    const hiddenMail = `${visible}${fillIn}@${domain}`;

    return res.status(200).json({
      objectId: newConfirmation._id,
      attempts: checkConfirmation.attempts,
      message: `Check ${hiddenMail} for new confirmation code`,
    });
  } catch (error) {
    console.log("Error on handleResend #usercontroller.js", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkEmail = async (req, res) => {
  try {
    const email = req.body?.email;
    if (!email) return res.status(400).json({ message: "Email is required" });
    const userExist = await User.findOne({ email: email });
    if (userExist)
      return res
        .status(400)
        .json({ message: "Account with this email already exists" });
    if (!userExist) return res.status(200).json({ message: true });
  } catch (error) {
    console.log("Error on checkEmail #userController.js", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
