import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    receiverId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
},{timestamps: true})

const Friend = mongoose.model('Friend', friendSchema)

export default Friend