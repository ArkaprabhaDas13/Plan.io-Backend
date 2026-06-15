import Task from "../models/Tasks.js"

export const getAllTasks = async(req, res)=>{
    const reqPayload = req.user;
    const taskStatus = req.query.status;        // task query
    const taskPriority = req.query.priority     // task priority
    const taskSearch = req.query.search         // search string for title or description
    const page = Number(req.query.page) || 1            // page
    const limit = Number(req.query.limit) || 10         // limit

    const query = {userId: reqPayload.userId}
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
          userId: '6a284a949c6577fa5f7baab0'
        })
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
        const editedTask = await Task.findById(req.params.taskId);
        if(editTask.userId.toString() !== req.user.userId)
        {
            return res.status(403).json({message: "Access denied!"});
        }
        if(!editedTask)
        {
            return res.status(404).json({
                message: "Task Not Found!"
            })
        }
        editedTask.title = req.body.title;
        editedTask.description = req.body.description;
        await editedTask.save();
        res.status(200).json(editedTask);        
    }catch(err)
    {
        res.status(500).json({
            message: err.message
        })
    }
}

export const deleteTask= async(req, res)=>{
    try{
        const deletedTask = await Task.findByIdAndDelete(req.params.taskId);
        if(deleteTask.userId.toString() !== req.user.userId)
        {
            return res.status(403).json({message: "Access denied!"});
        }
        if(!deleteTask)
        {
            res.status(404).json({
                message: "Task not found!"
            })
        }
        res.status(200).send({
            messsage: "Task deleted successfully!",
            deletedTask: deleteTask
        })
    }catch(err)
    {
        res.status(500).json({
            message: err.messaage
        })
    }
}