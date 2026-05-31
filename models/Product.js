import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: "User" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    overview: { type: String },
    additionalInfo: { type: String },
    idealFor: { type: String },
    keyFeatures: { type: String },
    compatibility: { type: String },
    technicalSpecifications: { type: String },
    materialType: { type: String },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    image: { type: [String], required: true },
    category: { type: String, required: true },
    colors: { type: [String], required: true },
    colorImages: { type: Object },
    length: { type: Number },
    height: { type: Number },
    depth: { type: Number },
    weight: { type: Number },
    boxIncludes: { type: String },
    careInstructions: { type: String },
    faq1: { type: String },
    faq2: { type: String },
    faq3: { type: String },
    faq4: { type: String },
    date: { type: Number, required: true }
}, { timestamps: true });

if (mongoose.models.Product) {
    delete mongoose.models.Product;
}
const Product = mongoose.model('Product', productSchema);

export default Product;
