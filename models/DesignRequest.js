import mongoose from "mongoose";

const designRequestSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'user' },
    designName: { type: String, required: true },
    description: { type: String },
    material: { type: String, required: true, enum: ['PLA', 'ABS', 'PETG', 'TPU', 'Resin'] },
    color: { type: String },
    quantity: { type: Number, required: true, min: 1, max: 100 },
    specialRequirements: { type: String },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    status: { 
        type: String, 
        required: true, 
        enum: ['PENDING', 'REVIEWING', 'QUOTED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING'
    },
    quote: { type: Number },
    estimatedDelivery: { type: Date },
    adminNotes: { type: String },
    date: { type: Number, required: true }
}, {
    timestamps: true
});

const DesignRequest = mongoose.models.designRequest || mongoose.model('designRequest', designRequestSchema);

export default DesignRequest;