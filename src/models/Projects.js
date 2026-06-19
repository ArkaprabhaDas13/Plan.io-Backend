import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import User from "./Users.js";

const ProjectSchema = new mongoose.Schema({
        name: {type: String, required: true},
        description: {type: String},
        groupId: {type: mongoose.Schema.ObjectId},
        createdBy: {type: mongoose.Schema.ObjectId, ref: User},
        status: {type: String, enum: ['active', 'inactive']}
    },
    {
        timestamp: true
    }
)

const Project = mongoose.model('Project', ProjectSchema);
export default Project;