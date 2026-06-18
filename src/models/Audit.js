import mongoose from "mongoose";

const AuditSchema = new mongoose.Schema({
        action: {type: String, enum: ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT"], required: true},
        entityType: {type: String, enum: ["task", "project", "comment", "user", "group"], required: true},
        entityId: {type: String, required: true},
        userId: {type: mongoose.Schema.Types.ObjectId, required: true},
        changes: {type: Object, default: {}, required: true}
    },
    {
        timestamps: true
    }
)

const Audit = mongoose.model("Audit", AuditSchema);
export default Audit;