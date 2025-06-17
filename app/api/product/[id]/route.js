import connectDb from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(request, context) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not authorized" });
        }

        const id = context.params.id;
        await connectDb();

        // Find the product and verify it belongs to the seller
        const product = await Product.findOne({ _id: id, userId });
        
        if (!product) {
            return NextResponse.json({
                success: false,
                message: "Product not found or unauthorized"
            });
        }

        // Delete the product
        await Product.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({
            success: false,
            message: error.message
        });
    }
} 