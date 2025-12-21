import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import generateJwtToken from "../lib/utils.js";

export const handleSignup = async (req, res) => {
  try {
    const {
      displayName = "",
      email = "",
      username = "",
      password = "",
      dob,
    } = req.body;

    // ---------- Display Name (string) ----------
    if (!displayName || !displayName.trim()) {
      return res.status(400).json({
        message: "Display name is required",
        errorOnInput: "displayName",
      });
    }
    const displayNameTrim = displayName.trim();
    if (displayNameTrim.length < 2) {
      return res.status(400).json({
        message: "Display name must be at least 2 characters",
        errorOnInput: "displayName",
      });
    }
    if (displayNameTrim.length > 30) {
      return res.status(400).json({
        message: "Display name cannot exceed 30 characters",
        errorOnInput: "displayName",
      });
    }

    // ---------- Email (string) ----------
    const emailTrim = email.trim().toLowerCase();
    const emailRegex = /^[a-z0-9._%+-]{2,}@[a-z0-9.-]{2,}\.[a-z]{2,}$/;
    if (!emailTrim || !emailRegex.test(emailTrim)) {
      return res.status(400).json({
        message: "Enter a valid email address",
        errorOnInput: "email",
      });
    }

    // ---------- Username (string) ----------
    const usernameTrim = username.trim().toLowerCase();
    const usernameRegex = /^[a-z0-9_]{4,20}$/;
    if (!usernameTrim) {
      return res.status(400).json({
        message: "Username is required",
        errorOnInput: "username",
      });
    }
    if (!usernameRegex.test(usernameTrim)) {
      return res.status(400).json({
        message:
          "Username must be 4–20 characters (letters, numbers, underscores)",
        errorOnInput: "username",
      });
    }

    // ---------- Password (string) ----------
    if (!password || password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
        errorOnInput: "password",
      });
    }

    // ---------- Date of Birth (Date object) ----------
    const dobDate = new Date(dob);
    if (!(dobDate instanceof Date) || isNaN(dobDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date of birth",
        errorOnInput: "dob",
      });
    }
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    const dayDiff = today.getDate() - dobDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
    if (age < 7) {
      return res.status(400).json({
        message: "Minimum age is 7 years",
        errorOnInput: "dob",
      });
    }

    // ---------- Check Existing User ----------
    const findUser = await User.findOne({
      $or: [{ email: emailTrim }, { username: usernameTrim }],
    });

    if (findUser) {
      if (findUser.email === emailTrim) {
        return res.status(400).json({
          message: "Account already exists with this email. Try to login",
          errorOnInput: "email",
        });
      } else if (findUser.username === usernameTrim) {
        return res.status(400).json({
          message: "This username is taken. Please choose another",
          errorOnInput: "username",
        });
      }
    }

    // ---------- Hash Password & Create User ----------
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      displayName: displayNameTrim,
      email: emailTrim,
      username: usernameTrim,
      password: hashPassword,
      dob: dobDate,
    });

    console.log("New User Registered");

    generateJwtToken(newUser._id.toString(), res);

    const { password: pass, ...rest } = newUser.toObject();

    return res.status(200).json({ authUser: rest });
  } catch (error) {
    console.log("Error on #signup #userController", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", errorOnInput: false });
  }
};

export const handleLogin = async (req, res) => {
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

    if (!user)
      return res.status(400).json({ message: "Handle or Password is invalid" });

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword)
      return res.status(400).json({ message: "Handle or Password is invalid" });

    generateJwtToken(user._id, res);
    res.status(200).json({ authUser: user });
  } catch (error) {
    console.log("Error on Login #userController.js", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleLogout = async (req, res) => {
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
