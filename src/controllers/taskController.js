import Task from "../models/Tasks.js"
import Comment from "../models/Comments.js"
import { createAuditLog } from "../services/createAuditLog.js";

export const getAllTasks = async(req, res)=>{
    const reqPayload = req.user;
    const taskStatus = req.query.status;        // task query
    const taskPriority = req.query.priority     // task priority
    const taskSearch = req.query.search         // search string for title or description
    const page = Number(req.query.page) || 1            // page
    const limit = Number(req.query.limit) || 10         // limit

    const query = {createdBy: reqPayload.userId}
    if(taskStatus)
    {
        query.status = taskStatus;
    }
    if(taskPriority)
    {
        query.priority = taskPriority;
    }
    if(taskSearch)
    {
        query.title = {$regex: taskSearch, $options: "i"}
    }
    try{
        const tasks = await Task.find(query).sort({dueDate: -1}).skip((page-1)*limit).limit(limit);     // PAGINATION implemented
        res.status(200).json(tasks);
    }catch(err)
    {
        res.status(500).json({
            message: err.message
        })
    }
}

export const createTask = async(req, res)=>{
    try{
        const createdTask = await Task.create({
          title: req.body.title,
          description: req.body.description,
          createdBy: req.user.userId
        })
        if(!createdTask)
        {
            throw new Error("Error in creating task!");
        }
        // Audit controller
        createAuditLog(createdTask._id, req.user.userId, "CREATE", "task");
        res.status(200).json(createdTask);
    }catch(err)
    {
        res.status(500).json({
            message: err.message
        })
    }
}

export const editTask = async(req, res)=>{
    try{
        const existingTask = await Task.findById(req.params.taskId);
        if(existingTask.createdBy.toString() !== req.user.userId)
        {
            return res.status(403).json({message: "Access denied!"});
        }
        if(!existingTask)
        {
            return res.status(404).json({
                message: "Task Not Found!"
            })
        }
        existingTask.title = req.body.title;
        existingTask.description = req.body.description;
        const editedTask = await existingTask.save();
        console.log(editedTask);
        // Audit controller
        createAuditLog(editedTask._id, req.user.userId, "UPDATE", "task");
        res.status(200).json(editedTask);        
    }catch(err)
    {
        res.status(500).json({
            message: err.message
        })
    }
}

export const deleteTask = async(req, res)=>{
    try{
        const existingTask = await Task.findById(req.params.taskId);
        if(existingTask.createdBy.toString() !== req.user.userId)
        {
            return res.status(403).json({message: "Access denied!"});
        }
        if(!existingTask)
        {
            res.status(404).json({
                message: "Task not found!"
            })
        }
        const deletedTask = await Task.findByIdAndDelete(req.params.taskId);
        // Audit controller
        createAuditLog(deletedTask._id, req.user.userId, "DELETE", "task");
        res.status(200).send({
            messsage: "Task deleted successfully!",
            deletedTask: deleteTask
        })
    }catch(err)
    {
        res.status(500).json({
            message: err.message
        })
    }
}

export const createComment = async(req, res)=>{
    try{
        const taskId = req.params.taskId;
        const newComment = await Comment.create({
            taskId: taskId,
            userId: req.user.userId,
            content: req.body.content
        })
        // Audit controller
        createAuditLog(newComment._id, req.user.userId, "CREATE", "comment");
        res.status(200).json({message: "Comment saved successfully!"})
    }catch(err)
    {
        res.status(200).json({message: err.message});
    }
}

export const getAllComments = async(req, res)=>{
    try{
        const taskId = req.params.taskId;
        const allComments = await Comment.find({
            taskId: taskId
        }).populate("userId", "name email");
        res.status(200).json({allComments});
    }catch(err){
        res.status(400).json({error: err.message});
    }
}
