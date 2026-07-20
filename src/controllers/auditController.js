import Audit from "../models/Audit.js"
import ApiResponse from "../utils/ApiResponse.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const showAllAudits = asyncHandler(async(req, res) =>{
    const allAudits = await Audit.find();
    if(!allAudits)
    {
        throw new Error("Audit data not present!");
    }
    const response = new ApiResponse(200, "Successfully fetched all Audit Logs", allAudits);
    res.status(200).json(response);
});


// NEED TO IMPLEMENT PAGINATION !!!! IMPORTANT