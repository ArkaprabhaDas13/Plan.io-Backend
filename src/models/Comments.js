import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({
        taskId: { type: ObjectId, required: true },
        userId: { type: ObjectId, required: true },
        content: { type: String, required: true },
    },
    {
        timestamps: true
    }
);

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;
