import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: "User" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    additionalInfo: { type: String },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    image: { type: [String], required: true },
    category: { type: String, required: true },
    colors: { type: [String], required: true },
    colorImages: { type: Object },
    date: { type: Number, required: true }
}, { timestamps: true });

// Force model recreation to ensure schema changes are applied
if (mongoose.models.Product) {
    delete mongoose.models.Product;
}
const Product = mongoose.model('Product', productSchema);

export default Product;