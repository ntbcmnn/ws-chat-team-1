import mongoose, {Schema} from "mongoose";

const MessageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date:{
        type: Date,
        default: Date.now(),
    }
})

export const Message = mongoose.model("Message", MessageSchema);