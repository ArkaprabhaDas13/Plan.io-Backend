import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { Schema } from "mongoose";

const CommentSchema = mongoose.Schema({
        taskId: { type: Schema.Types.ObjectId, required: true },
        userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        content: { type: String, required: true },
    },
    {
        timestamps: true
    }
);

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;
