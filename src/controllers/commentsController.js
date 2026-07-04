import TaskComment from "../models/TaskComments.js"
import { createAuditLog } from "../services/createAuditLog.js";

export const getAllComments = async(req, res)=>{
    try{
        const taskId = req.params.taskId;
        const allComments = await TaskComment.find({
            taskId
        })
        if(!allComments)
        {
            throw new Error(`error while fetching all comments for ${taskId}`);
        }
        res.status(200).json(allComments);
    }catch(err){
        res.status(400).json({message: err.message});
    }
}

export const createComment = async(req, res)=>{
    try{
        const user = req.user;
        const taskId = req.params.taskId;
        if(req.body.createdBy !== user._id)
        {
            throw new Error("You cannot use someone else's Token and get away with it!");
        }
        const createdComment = await TaskComment.create({
            description: req.body.description,
            createdBy: user.userId,
            taskId: taskId
        })
        if(!createdComment)
        {
            throw new Error("Error while creating a new Comment!");
        }
        res.status(200).json(createdComment);
    }catch(err){
        res.status(400).json({message: err.message});
    }
}

export const editComment = async (req, res)=>{
    try{
        const commentId = req.params.commentId;
        const existingComment = await TaskComment.findById(commentId);
        if(!existingComment)
        {
            return res.status(403).json({message: "The comment doesnt exist!"});
        }
        if(!existingComment.userId.equals(req.user.userId))      // used equals instead of == and converting id to string
        {
            return res.status(401).json({
                message: "User Not Authenticated!"
            })
        }
        const updatedComment = await TaskComment.findByIdAndUpdate(commentId, {$set:{content: req.body.content}}, {new: true});
        if(!updatedComment)
        {
            return res.status(404).json({message: "The comment doesnt exist!"});
        }
        // Audit controller
        createAuditLog(updatedComment._id, req.user.userId, "UPDATE", "comment");
        res.status(200).json(updatedComment);
    }catch(err)
    {
        res.status(400).json({message: err.message});
    }
}

export const deleteComment = async (req, res) =>{ 
    try{
        const commentId = req.params.commentId;
        const taskId = req.params.taskId;
        const existingComment = await TaskComment.findById(commentId);
        if(!existingComment)
        {
            return res.status(403).json({message: "The comment doesn't exist!"});
        }
        if(existingComment.taskId.toString() !== taskId)
        {
            return res.status(401).json({message: `This comment doesnt belong to the taskId ${taskId}`});
        }
        if(existingComment.createdBy.toString() !== req.user.userId)
        {
            return res.status(401).json({
                message: "User Not Authenticated!"
            })
        }
        const deletedComment = await TaskComment.findByIdAndDelete(commentId);
        if(!deletedComment)
        {
            return res.status(400).json({message: "Error in deleting the comment!"});
        }
        // Audit controller
        createAuditLog(deletedComment._id, req.user.userId, "DELETE", "comment");
        res.status(200).json(deletedComment);
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}