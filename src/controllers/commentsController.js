import TaskComment from "../models/TaskComments.js"
import { createAuditLog } from "../services/createAuditLog.js"; 
import Task from '../models/Tasks.js';
import ApiResponse from "../utils/ApiResponse.js"; 
import ErrorResponse from "../utils/ErrorResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAllComments = asyncHandler(async(req, res)=>{
    const taskId = req.params.taskId;
    const ContainingTask = await Task.find({_id: taskId});
    if(!ContainingTask)
    {
        throw new Error("Invalid task ID")
    }
    const allComments = await TaskComment.find({taskId}).populate("createdBy", "name email");
    if(!allComments)
    {
        throw new Error(`error while fetching all comments for ${taskId}`);
    }
    const response = new ApiResponse(200, "successfully fetched all the data", allComments);
    res.status(200).json(response);
});

export const createComment = asyncHandler(async(req, res)=>{
    console.log(req.body.createdBy);
    console.log(req.user.userId);
    const user = req.user;
    const taskId = req.params.taskId;
    if(req.body.createdBy !== user.userId)
    {
        throw new Error("Something went wrong, please login again!");
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
    createAuditLog(createdComment._id, user.userId, "CREATE", "comment");
    const response = new ApiResponse(201, "successfully created comment", createdComment);
    res.status(200).json(response);
});

// export const editComment = async (req, res)=>{
//     try{
//         const commentId = req.params.commentId;
//         const existingComment = await TaskComment.findById(commentId);
//         if(!existingComment)
//         {
//             return res.status(403).json({message: "The comment doesnt exist!"});
//         }
//         if(!existingComment.userId.equals(req.user.userId))      // used equals instead of == and converting id to string
//         {
//             return res.status(401).json({
//                 message: "User Not Authenticated!"
//             })
//         }
//         const updatedComment = await TaskComment.findByIdAndUpdate(commentId, {$set:{content: req.body.content}}, {new: true});
//         if(!updatedComment)
//         {
//             return res.status(404).json({message: "The comment doesnt exist!"});
//         }
//         // Audit controller
//         createAuditLog(updatedComment._id, req.user.userId, "UPDATE", "comment");
//         res.status(200).json(updatedComment);
//     }catch(err)
//     {
//         res.status(400).json({message: err.message});
//     }
// }

// export const deleteComment = async (req, res) =>{ 
//     try{
//         const commentId = req.params.commentId;
//         const taskId = req.params.taskId;
//         const existingComment = await TaskComment.findById(commentId);
//         if(!existingComment)
//         {
//             return res.status(403).json({message: "The comment doesn't exist!"});
//         }
//         if(existingComment.taskId.toString() !== taskId)
//         {
//             return res.status(401).json({message: `This comment doesnt belong to the taskId ${taskId}`});
//         }
//         if(existingComment.createdBy.toString() !== req.user.userId)
//         {
//             return res.status(401).json({
//                 message: "User Not Authenticated!"
//             })
//         }
//         const deletedComment = await TaskComment.findByIdAndDelete(commentId);
//         if(!deletedComment)
//         {
//             return res.status(400).json({message: "Error in deleting the comment!"});
//         }
//         // Audit controller
//         createAuditLog(deletedComment._id, req.user.userId, "DELETE", "comment");
//         res.status(200).json(deletedComment);
//     }catch(err){
//         res.status(400).json({
//             message: err.message
//         })
//     }
// }