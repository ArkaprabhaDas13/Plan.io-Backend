import Task from "../models/Tasks.js"
import Project from "../models/Projects.js";
import { createAuditLog } from "../services/createAuditLog.js";
import ApiResponse from "../utils/ApiResponse.js";
import ErrorResponse from "../utils/ErrorResponse.js";

export const getAllTasks = async(req, res)=>{
    const reqPayload = req.user;
    const taskStatus = req.query.status;        // task query
    const taskPriority = req.query.priority     // task priority
    const search = req.query.search         // search string for title or description
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
    if(search)
    {
        query.$or = [
            {title: {$regex: search, $options: "i"}},
            {description: {$regex: search, $options: "i"}}
        ]
    }
    try{
        const tasks = await Task.find(query).sort({dueDate: -1}).skip((page-1)*limit).limit(limit);     // PAGINATION implemented
        const response = new ApiResponse(200, "Successfully created a new task", tasks);
        res.status(200).json(response);
    }catch(err)
    {
        res.status(500).json({
            message: err.message
        })
    }
}

export const getOneTask = async (req, res)=>{
    const taskId = req.params.taskId;
    try{
        const existingTask = await Task.findById(taskId);
        if(req.user.userId != existingTask.createdBy.toString())
        {
            return res.status(400).json({message: "Unauthorized Task"});
        }
        if(!existingTask)
        {
            return res.status(400).json({message: "No Task found!"});
        }
        res.status(200).json(existingTask);
    }catch(err){
        res.status(400).json({message: err.message});
    }
}

export const getProjectTasks = async(req, res)=>{
    
    const taskStatus = req.query.status;        // task query
    const taskPriority = req.query.priority     // task priority
    const taskSearch = req.query.search         // search string for title or description
    const page = Number(req.query.page) || 1            // page
    const limit = Number(req.query.limit) || 10         // limit
    const projectId = req.params.projectId        // filter by project id

    const query = {createdBy : req.user.userId, projectId : projectId};
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
        const allTasks = await Task.find(query).sort({dueDate: -1}).skip((page-1)*limit).limit(limit);     // PAGINATION implemented
        const response = new ApiResponse(200, "Successfully fetched all tasks", allTasks);
        res.status(200).json(response);
    }catch(err){
        const response = new ErrorResponse(400, "error while getting all tasks", err.message);
        res.status(500).json(response);
    }
}

export const createTask = async(req, res)=>{
    try{
        const createdTask = await Task.create({
          title: req.body.title,
          description: req.body.description,
          createdBy: req.user.userId,
          projectId: req.body.projectId
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
        const response = new ErrorResponse(400, "error while creating a new response", err.message);
        res.status(500).json(response);
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
        const response = new ErrorResponse(400, "error while editing task", err.message);
        res.status(500).json(response);
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
        const response = new ErrorResponse(400, "error while deleting a task", err.message);
        res.status(500).json(response);
    }
}
