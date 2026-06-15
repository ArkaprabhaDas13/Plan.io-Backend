import express from 'express';
const router = express.Router();
import User from '../models/Users.js'
import Task from '../models/Tasks.js'

// test User route
router.get("/test-user", async(req, res)=>{
    res.send("User Route!");
})

// test Tasks route
router.get("/test-tasks", async(req, res)=>{
    res.send("Test route!");
})

// test Audit route
router.get("/test-project", async(req, res)=>{
    res.send("Test Project!");
})

export default router;