import { ObjectId, Timestamp } from "mongodb";
import mongoose from "mongoose";

const TaskSchema = mongoose.Schema({
        title: {type: String, required: true},
        description: {type: String},
        status: {type: String, enum:['active', 'inactive']},
        priority: {type: String},
        dueDate: {type: Date},
        projectId: {type: ObjectId},
        userId: {type: ObjectId, required: true},
    },
    {
        timestamp: true
    }
)

const Task = mongoose.model('Task', TaskSchema);
export default Task;