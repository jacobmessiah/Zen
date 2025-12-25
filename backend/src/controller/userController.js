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
        message: "DISPLAY_NAME_REQUIRED",
        errorOnInput: "displayName",
      });
    }
    const displayNameTrim = displayName.trim();
    if (displayNameTrim.length < 2) {
      return res.status(400).json({
        message: "DISPLAY_NAME_NOT_COMPLETE",
        errorOnInput: "displayName",
      });
    }
    if (displayNameTrim.length > 30) {
      return res.status(400).json({
        message: "DISPLAY_NAME_TOO_LONG",
        errorOnInput: "displayName",
      });
    }

    // ---------- Email (string) ----------
    const emailTrim = email.trim().toLowerCase();
    const emailRegex = /^[a-z0-9._%+-]{2,}@[a-z0-9.-]{2,}\.[a-z]{2,}$/;
    if (!emailTrim || !emailRegex.test(emailTrim)) {
      return res.status(400).json({
        message: "EMAIL_INVALID",
        errorOnInput: "email",
      });
    }

    // ---------- Username (string) ----------
    const usernameTrim = username.trim().toLowerCase();
    const usernameRegex = /^[a-z0-9_]{4,20}$/;
    if (!usernameTrim) {
      return res.status(400).json({
        message: "USERNAME_REQUIRED",
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
        message: "DOB_INVALID",
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
        message: "DOB_TOO_YOUNG",
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
          message: "USER_ALREADY_EXISTS",
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
    res.status(500).json({ message: "SERVER_ERROR", errorOnInput: false });
  }
};

export const handleLogin = async (req, res) => {
  try {
    const password = req.body.password;
    const handle = req.body.handle?.trim().toLowerCase();

    if (!handle) return res.status(400).json({ message: "HANDLE_REQUIRED" });
    if (!password)
      return res.status(400).json({ message: "PASSWORD_REQUIRED" });
    const user = await User.findOne({
      $or: [{ username: handle }, { email: handle }],
    });

    if (!user) return res.status(400).json({ message: "INVALID_CREDENTIALS" });

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword)
      return res.status(400).json({ message: "INVALID_CREDENTIALS" });

    generateJwtToken(user._id, res);
    res.status(200).json({ authUser: user });
  } catch (error) {
    console.log("Error on Login #userController.js", error?.message || error);
    res.status(500).json({ message: "SERVER_ERROR" });
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

export const handleCheckUsername = async (req, res) => {
  try {
    const usernameQueryKey = req.body.usernameQueryKey;
    if (!usernameQueryKey)
      return res.status(400).json({
        message: "NO_USERNAME_QUERY",
        errorOnInput: false,
        isError: true,
      });

    const findUser = await User.findOne({ username: usernameQueryKey });

    if (findUser) {
      return res.status(400).json({
        message: "USERNAME_TAKEN",
        isError: true,
        usernameQueryKey,
        errorOnInput: true,
      });
    } else {
      return res.status(200).json({
        message: "USERNAME_AVAILABLE",
        isError: false,
        errorOnInput: false,
        usernameQueryKey,
      });
    }
  } catch (error) {
    console.log(
      "Error on #checkUsername #userController.js",
      error?.message || error
    );
    const errorObject = {
      errorOnInput: false,
      message: "SERVER_ERROR",
      isError: true,
    };

    return res.status(500).json({ errorObject });
  }
};

export const checkUser = (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    console.log("Error on #check #userController.js", error.message);
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};
