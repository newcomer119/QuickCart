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
    fileUrl: { type: String, required: true },
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
    timestamps: true,
    strict: true
});

// Pre-save hook to ensure no filePath field is saved
designRequestSchema.pre('save', function(next) {
    if (this.filePath) {
        delete this.filePath;
    }
    next();
});

// Pre-validate hook to ensure filePath is not required
designRequestSchema.pre('validate', function(next) {
    if (this.filePath) {
        delete this.filePath;
    }
    next();
});

// Force recompilation of the model
if (mongoose.models.designRequest) {
    delete mongoose.models.designRequest;
}

const DesignRequest = mongoose.model('designRequest', designRequestSchema);

export default DesignRequest;