import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
        name: {type: String, required: true},
        description: {type: String},
        userId: {type: ObjectId, required: true},
        status: {type: String, enum: ['active', 'inactive']},
    },
    {
        timestamp: true
    }
)

const Project = mongoose.model('Project', ProjectSchema);
export default Project;