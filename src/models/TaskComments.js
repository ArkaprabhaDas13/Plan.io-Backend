import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { Schema } from "mongoose";

const TaskCommentSchema = mongoose.Schema({
        description: { type: String, required: true },
        taskId: { type: Schema.Types.ObjectId, required: true },
        createdBy: { type: Schema.Types.ObjectId, required: true, ref: "User" }
    },
    {
        timestamps: true
    }
);

const TaskComment = mongoose.model('TaskComment', TaskCommentSchema);
export default TaskComment;