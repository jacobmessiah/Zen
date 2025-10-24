import imagekit from "../lib/kitUploader.js";
import User from "../model/userModel.js";
import bcrypt from "bcryptjs";

export const getUser = async (req, res) => {
  try {
    const username = req.body?.username;
    if (!username)
      return res.status(400).json({ message: "Username required" });
    const person = await User.findOne({ username: username }).select(
      "-password -_id -admin -loginType -__v -updatedAt"
    );

    if (!person) return res.status(400).json({ message: "User not found" });

    return res.status(200).json(person);
  } catch (error) {
    console.log("error on getUser #profileController.js", error);
    return res.status(200).json({ message: "Internal server error" });
  }
};

export const changeUsername = async (req, res) => {
  try {
    const password = req.body?.password;
    const username = req.body?.username;

    if (!password)
      return res
        .status(400)
        .json({ message: "Password is Required to change your username" });
    if (!username)
      return res
        .status(400)
        .json({ message: "Username is Required to Change Username" });

    const user = req.user;
    if (!user) return res.status(400).json({ message: "" });

    const findUser = await User.findOne({ username });

    const isPasswordCorrect = await bcrypt.compare(password, findUser.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Incorrect Password" });

    findUser.username = username;
    await findUser.save();

    return res.status(200).json(findUser);
  } catch (error) {
    console.log("Error on changeUser #profileController.js", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const updates = {};

    for (let key in req.body) {
      if (
        (key === "coverImage" ||
          key === "profilePic" ||
          key === "profilePicsm") &&
        req.body[key]
      ) {
        if (req.body[key].startsWith("data:image")) {
          const upload = await imagekit.upload({
            file: req.body[key].split(",")[1],
            fileName: `${key}_${user._id}.jpg`,
            folder: "profiles",
          });

          updates[`profile.${key}`] = upload.url;
        } else {
          updates[`profile.${key}`] = req.body[key];
        }
      } else if (key === "name" || key === "username") {
        updates[key] = req.body[key];
      } else if (key === "bio") {
        updates[`profile.${key}`] = req.body[key];
      } else {
        updates[`profile.${key}`] = req.body[key];
      }
    }

    const findAndUpdate = await User.findByIdAndUpdate(
      user._id,
      { $set: updates },
      { new: true }
    );

    
    return res.status(200).json(findAndUpdate);
  } catch (error) {
    console.log("Error on updateProfile", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
