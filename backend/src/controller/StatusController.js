import Status from "../model/StatusModel.js";
import imagekit from "../lib/kitUploader.js";
import Friend from "../model/friendModel.js";
import { getAUserSocketId, io } from "../lib/io.js";

export const createStatus = async (req, res) => {
  try {
    const user = req.user;
    const type = req.body.type;
    const image = req.body.image;
    const text = req.body.text;

    if (type === "image") {
      if (!image) return res.status(400).json({ message: "Image is Required" });
      const base64 = image.split(",")[1];
      const newStatus = new Status();
      newStatus.creatorId = user._id;
      newStatus.type = type;

      if (text) {
        newStatus.text = text;
      }

      const uploadResponse = await imagekit.upload({
        fileName: crypto.randomUUID(),
        file: base64,
        folder: "Status",
      });

      newStatus.url = uploadResponse.url;
      newStatus.fieldId = uploadResponse.fileId;

      newStatus.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await newStatus.save();
      const findFriends = await Friend.find({
        $or: [{ senderId: user._id }, { receiverId: user._id }],
      });

      if (findFriends.length > 0) {
        const friends = [];
        for (const friend of findFriends) {
          if (friend.senderId === user._id) {
            friends.push(friend.receiverId);
          } else {
            friends.push(friend.senderId);
          }
        }

        friends.forEach((fr) => {
          const friendSocket = getAUserSocketId(fr.toString());
          if (friendSocket) {
            io.to(friendSocket).emit("newStatus", newStatus);
          }
        });
      }

      return res.status(200).json(newStatus);
    }

    return res.status(400).json({ message: "Request Failed" });
  } catch (error) {
    console.log("error on createStatus  #StatusController.js ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyStatus = async (req, res) => {
  try {
    const user = req.user;
    const allUserStatus = await Status.find({ creatorId: user._id });
    return res.status(200).json(allUserStatus);
  } catch (error) {
    console.log("error on getMyStatus #StatusController.js", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFriendStatus = async (req, res) => {
  try {
    const user = req.user;

    const AllStatus = [];

    const findFriends = await Friend.find({
      $or: [{ senderId: user._id }, { receiverId: user._id }],
    }).populate("senderId receiverId", "profile");

    const fetchStatus = await Promise.all(
      findFriends.map(async (friend) => {
        const isMeSender =
          friend.senderId._id.toString() === user._id.toString();
        const otherUser = isMeSender ? friend.receiverId : friend.senderId;

        const status = await Status.find({ creatorId: otherUser._id });

        if (status.length > 0) {
          return {
            friend: otherUser,
            allStatus: status,
          };
        }
      })
    );

    const results = fetchStatus.filter(Boolean);

    res.status(200).json(results);
  } catch (error) {
    console.log("Error on getFriendStatus #StatusController.js", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const socketViewedStatus = async (data) => {
  try {
    await Status.findByIdAndUpdate(
      data.statusId,
      {
        $addToSet: { viewers: data.myself },
      },
      { new: true }
    );
  } catch (error) {
    console.log("Error on SocketViewStatus #StatusController.js  ", error);
  }
};
