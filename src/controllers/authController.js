import User from "../models/Users.js";
import bcrypt from 'bcrypt';
import validator from 'email-validator';
import jwt from 'jsonwebtoken';
import Audit from "../models/Audit.js";
import {createAuditLog} from "../services/createAuditLog.js";
import ApiResponse from "../utils/ApiResponse.js";
import ErrorResponse from "../utils/ErrorResponse.js";

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

        const response = new ApiResponse(200, "Successfully created a new User", newUser);
        res.status(201).json(response);
    }catch(err)
    {
        const response = new ErrorResponse(400, "error while registering a new user", err.message);
        res.status(400).json(response);
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
        const responseUserDetails = {
            user:{
                _id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email
            },
            token: token
        }
        const response = new ApiResponse(200, "Successfully Logged In", responseUserDetails);
        return res.status(200).json(response);
    }catch(err)
    {
        const response = new ErrorResponse(400, "Error while logging in", err.message);
        res.status(500).json(response);
    }
}

export const aboutMe = async (req, res)=>{
    try{
        const reqPayload = req.user;
        // find existing user
        let existingUser = await User.findById(reqPayload.userId).select("-password -_id -createdAt -updatedAt -__v");
        const response = new ApiResponse(200, "User authenticated successfully", existingUser);
        return res.status(200).json(response);
    }catch(err){
        const response = new ApiResponse(400, "Error in authenticating user", err.message)
        res.status(500).json(response);
    }
}

export const logout = async (req, res)=>{
    try{
        let loggedInUser = await User.findById(req.user.userId);
        console.log(loggedInUser);
        // Audit controller
        createAuditLog(loggedInUser._id, loggedInUser._id, "LOGOUT", "user");
        const response = new ApiResponse(200, "User Logged Out successfully!");
        res.status(200).json(response);
    }catch(err){
        res.status(400).json({message: err.message});
    }
}