import Audit from "../models/Audit.js";

export const createAuditLog = async (entityId, userId, action, entityType)=>{
    // save to DB
    try{
        const newAudit = await Audit.create({
            entityId, userId, action, entityType
        })
        if(!newAudit)
        {
            throw new Error("Error in creating new audit entry!");
        }
    }catch(err)
    {
        console.error(err.message);
    }
}
