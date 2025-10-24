import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      required: true,
      type: String,
    },
    //All Profile Details like animations, profilepic, coverimage, chat plates are here
    profile: {
      profilePic: String,
      coverImage: String,
      tags: [String],
      profileAnimation: String,
      chatPlate: String,
      avatarEffect: String,
      bio: String,
      profilePicsm: String,
    },
    email: {
      type: String,
      required: true,
    },
    hyperZen: {
      default: false,
      type: Boolean,
    },
    loginType: {
      type: String,
      enum: ["google", "email"],
      default: "email",
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isUsernameFinalized: {
      default: true,
      type: Boolean,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
