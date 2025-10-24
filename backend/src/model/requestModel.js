import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
 senderId: {
   type: mongoose.Types.ObjectId,
   required: true,
   ref: 'User'
 },
 receiverId: {
   type: mongoose.Types.ObjectId,
   required: true,
   ref: 'User'
 },
 status: {
   type: String,
   enum: ['pending', 'accepted', 'rejected', 'blocked'],
   default: 'pending'
 },
 message: {
   type: String,
   maxLength: 200,
   trim: true
 }
}, { 
 timestamps: true 
});   

// Compound index to prevent duplicate requests
requestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

// Index for faster queries
requestSchema.index({ receiverId: 1, status: 1 });
requestSchema.index({ senderId: 1, status: 1 });

const Request = mongoose.model('Request', requestSchema);

export default Request;