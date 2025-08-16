import mongoose from "mongoose";

const designRequestSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'User' }, // Changed from 'user' to 'User'
    designName: { type: String, required: true },
    description: { type: String },
    material: { type: String, required: true, enum: ['PLA', 'ABS', 'PETG', 'TPU', 'Resin'] },
    color: { 
        type: String, 
        enum: [
            'Pitch black',
            'Pure white', 
            'Lemon yellow',
            'Mauve purple',
            'Nuclear red',
            'Outrageous orange',
            'Atomic pink',
            'Royal blue',
            'Light grey',
            'Light blue',
            'Grass green',
            'Beige brown',
            'Teal blue',
            'Army green',
            'Dark grey',
            'Ivory white',
            'Rust copper',
            'Appricot',
            'Lagoon blue',
            'Forest green',
            'Fluorescent orange',
            'Fluorescent green',
            'Transparent',
            'Bhama yellow',
            'Chocolate brown',
            'Fluorescent yellow',
            'Levender violet',
            'Magenta',
            'Military khaki',
            'Ryobix green',
            'Simply silver',
            'Midnight grey',
            'Thanos purple',
            'Cool( lithopane ) white'
        ]
    },
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