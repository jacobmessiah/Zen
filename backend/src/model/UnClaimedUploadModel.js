import mongoose from "mongoose";

const UnClaimedUploadSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    fileId: { type: String, required: true },
    filePath: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: Number, required: true },
    type: { type: String, required: true },
    mimeType: { type: String, required: true },
    canDeleteAt: { type: Date, required: true },
  },
  { timestamps: true },
);

const UnClaimedUpload = mongoose.model(
  "unclaimedUpload",
  UnClaimedUploadSchema,
);

export default UnClaimedUpload;
