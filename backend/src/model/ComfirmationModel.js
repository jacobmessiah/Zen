import mongoose from "mongoose";

const ConfirmationSchema = new mongoose.Schema({ 
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    attempts: {
        type: Number,
        default: 1
    },

    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0}
    }

},{timestamps: true})

const Confirmation = mongoose.model('Confirmation' , ConfirmationSchema)
Confirmation.syncIndexes()

export default Confirmation;