import Audit from "../models/Audit.js"

export const showAllAudits = async(req, res) =>{
    try{
        const allAudits = await Audit.find();
        if(!allAudits)
        {
            throw new Error("Audit data not present!");
        }
        res.status(200).json(allAudits);
    }catch(err)
    {
        res.status(400).json({message: err.message});
    }
}


// NEED TO IMPLEMENT PAGINATION !!!! IMPORTANT