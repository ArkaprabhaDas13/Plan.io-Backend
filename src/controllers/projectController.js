import Project from "../models/Projects.js"
import Audit from "../models/Audit.js";
import { createAuditLog } from "../services/createAuditLog.js";
import Task from "../models/Tasks.js";
import ApiResponse from "../utils/ApiResponse.js";
import ErrorResponse from "../utils/ErrorResponse.js";

export const createProject = async (req, res) => {
    try{
        const newProject = await Project.create({
            name: req.body.name,
            description: req.body.description,
            createdBy: req.user.userId,
            status: 'active'
        })
        if(!newProject)
        {
            throw new Error("Error while creating project!");
        }
        // Audit controller
        createAuditLog(newProject._id, req.user.userId, "CREATE", "project");
        const response = new ApiResponse(200, "Project created successfully", newProject);
        res.status(200).json(response);
    }catch(err)
    {
        const response = new ErrorResponse(400, "Error while creating a project", err.message);
        res.status(400).json(response);
    }
}

export const getAllProjects = async (req, res)=>{
    try{
        const allProjects = await Project.find({createdBy : req.user.userId});
        if(allProjects.length == 0)
        {
            throw new Error("This user has no Projects yet!");
        }
        const response = new ApiResponse(200, "Fetched all projects!", allProjects);
        res.status(200).json(response);
    }catch(err)
    {
        const response = new ErrorResponse(400, "error while getting all the projects", err.message);
        res.status(404).json(response);
    }
}

export const getOneProject = async (req, res)=>{
    try{
        const projectId = req.params.projectId;
        const existingProject = await Project.findById(projectId);
        if(req.user.userId !== existingProject.createdBy.toString())
        {
            return res.status(401).json({message: "Unauthorised Content!"})
        }
        if(!existingProject)
        {
            throw new Error("Project not found!");
        }
        const response = new ApiResponse(200, "Successfully fetched 1 project", existingProject);
        res.status(200).json(response);
    }catch(err)
    {
        const response = new ErrorResponse(400, "error while getting a project", err.message);
        res.status(404).json(response);
    }
}

export const updateProject = async (req, res)=>{
    try{
        const existingProject = await Project.findById(req.params.projectId);
        if(existingProject.createdBy.toString() !== req.user.userId)
        {
            return res.status(401).json({message: "Unauthorised Content!"});
        }
        if(!existingProject)
        {
            throw new Error("project not found!");
        }
        // NAME IS A MANDATORY EDIT FIELD
        let query={
            name: req.body.name
        };
        if(req.body.description)
        {
            query.description = req.body.description;
        }
        const updatedProject = await Project.findByIdAndUpdate(req.params.projectId, {$set: query}, {new: true});
        if(!updatedProject)
        {
            return res.status(400).json({message: "Error in updating the Project!"});
        }
        // Audit controller
        createAuditLog(updatedProject._id, req.user.userId, "UPDATE", "project");
        const response = new ApiResponse(200, "Successfully updated the Project", updateProject);
        res.status(200).json(response);
    }catch(err){
        const response = new ErrorResponse(400, "error while updating the project", err.message);
        res.status(400).json(response);
    }
} 

export const deleteProject = async (req, res)=>{
    try{
        let existingProject = await Project.findById(req.params.projectId);
        if(existingProject.createdBy.toString() !== req.user.userId)
        {
            return res.status(401).json({message: "Unauthorised Content!"});
        }
        const deletedProject = await Project.findByIdAndDelete(req.params.projectId);
        if(!deletedProject)
        {
            throw new Error("project not found!");
        }
        // Audit controller
        createAuditLog(deletedProject._id, req.user.userId, "DELETE", "project");
        const response = new ApiResponse(200, "Project successfully deleted!", deletedProject);
        res.status(200).json(response);
    }catch(err){
        const response = new ErrorResponse(400, "error while deleting the project", err.message);
        res.status(400).json(response);
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
        const response = new ApiResponse(200, "successfully fetched all the tasks", allTasks);
        res.status(200).json(response);
    }catch(err){
        const response = new ErrorResponse(500, "error while fetching all tasks", err.message);
        res.status(500).json(response);
    }
}