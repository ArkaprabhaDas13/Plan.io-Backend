import Project from "../models/Projects.js"
import Audit from "../models/Audit.js";
import { createAuditLog } from "../services/createAuditLog.js";

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
        res.status(200).json(newProject);
    }catch(err)
    {
        res.status(400).json({message: err.message});
    }
}

export const getAllProjects = async (req, res)=>{
    try{
        const allProjects = await Project.find({createdBy : req.user.userId});
        if(allProjects.length == 0)
        {
            throw new Error("Projects not found!");
        }
        res.status(200).json(allProjects);
    }catch(err)
    {
        res.status(404).json({message: err.message});
        
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
        res.status(200).json(existingProject);
    }catch(err)
    {
        res.status(404).json({message: err.message});
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
        res.status(200).json(updatedProject);
    }catch(err){
        res.status(400).json({message: err.message});
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
        res.status(200).json(deletedProject);
    }catch(err){
        res.status(400).json({message: err.message});
    }
}