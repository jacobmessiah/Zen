import mongoose from "mongoose";

const StatusSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Types.ObjectId,
    },
    url: String,
    text: String,
    fieldId: String,
    expiresAt: Date,
    viewers: Array
  },
  { timestamps: true }
);

StatusSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const Status = mongoose.model("Status", StatusSchema);

export default Status;
