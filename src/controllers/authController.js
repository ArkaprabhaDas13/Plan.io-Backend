import User from "../models/Users.js";
import bcrypt from 'bcrypt';
import validator from 'email-validator';
import jwt from 'jsonwebtoken';
import Audit from "../models/Audit.js";
import {createAuditLog} from "../services/createAuditLog.js";

async function hashPassword(password){
    const saltRound = 12;
    const hashedPassword = await bcrypt.hash(password, saltRound);
    return hashedPassword;
}

export const registerUser = async(req, res)=>{
    try{
        const {name, email, password} = req.body;
        // check if user exists
        const existingUser = await User.findOne({
            email: email
        })
        if(existingUser)
        {
            return res.status(409).json({
                message: "User already present. Please login!"
            })
        }
        // creating new user
        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        })
        // Audit controller
        createAuditLog(newUser._id, newUser._id, "CREATE", "user");
        res.status(201).json({message: "User creation successful!"});
    }catch(err)
    {
        res.status(400).json({message: err.message});
    }
}

export const loginUser = async(req, res)=>{
    const {email, password} = req.body;
    try{
        const existingUser = await User.findOne({email: email});
        if(!existingUser)
        {
            return res.status(401).json({
                message: "User not found!"
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser?.password)
        if(!isPasswordCorrect){
            return res.status(401).json({
                message: "User Credentials Wrong!"
            })
        }
        let payload = {
            userId : existingUser._id,
            email : existingUser.email
        }
        // Create JWT Token (invalid after 24hrs)
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '24h'})
        // Audit controller
        createAuditLog(existingUser._id, existingUser._id, "LOGIN", "user");
        return res.status(200).json({
            message: "User logged in!",
            token: token,
            user: {
                name: existingUser.name,
                email: existingUser.email
            }
        })
    }catch(err)
    {
        res.status(500).json({message: err.message});
    }
}

export const aboutMe = async (req, res)=>{
    try{
        const reqPayload = req.user;
        // find existing user
        let existingUser = await User.findById(reqPayload.userId).select("-password -_id -createdAt -updatedAt -__v");
        console.log(existingUser);
        return res.status(200).json(existingUser);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

export const logout = async (req, res)=>{
    try{
        let loggedInUser = await User.findById(req.user.userId);
        console.log(loggedInUser);
        // Audit controller
        createAuditLog(loggedInUser._id, loggedInUser._id, "LOGOUT", "user");
        res.status(200).json({
            message: "Successfully Logged Out!"
        });
    }catch(err){
        res.status(400).json({message: err.message});
    }
}