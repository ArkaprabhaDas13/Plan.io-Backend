import mongoose from "mongoose";

const AuditSchema = new mongoose.Schema({
        action: {type: String, enum: ["CREATE", "UPDATE", "DELETE"], required: true},
        entityType: {type: mongoose.Schema.Types.ObjectId, enum: ["task", "project", "comment"], required: true},
        entityId: {type: String, required: true},
        userId: {type: ObjectId, required: true},
        changes: {type: Object, default: {}, required: true}
    },
    {
        timestamps: true
    }
)

const Audit = mongoose.model("Audit", AuditSchema);
export default Audit;