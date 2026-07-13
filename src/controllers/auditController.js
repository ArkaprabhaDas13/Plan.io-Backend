import Audit from "../models/Audit.js"
import ApiResponse from "../utils/ApiResponse.js";
import ErrorResponse from "../utils/ErrorResponse.js";

export const showAllAudits = async(req, res) =>{
    try{
        const allAudits = await Audit.find();
        if(!allAudits)
        {
            throw new Error("Audit data not present!");
        }
        const response = new ApiResponse(200, "Successfully fetched all Audit Logs", allAudits);
        res.status(200).json(response);
    }catch(err)
    {
        const response = new ErrorResponse(400, "error while fetching all audits", err.message);
        res.status(400).json(response);
    }
}


// NEED TO IMPLEMENT PAGINATION !!!! IMPORTANT