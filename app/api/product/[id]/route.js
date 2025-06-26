import connectDb from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload a file to Cloudinary
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        stream.end(buffer);
    });
};

export async function GET(request, { params }) {
    try {
        await connectDb();
        const product = await Product.findById(params.id);

        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ success: false, message: "Error fetching product" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { userId } = getAuth(request);
    if (!userId) {
        return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }
    const isSeller = await authSeller(userId);
    if (!isSeller) {
        return NextResponse.json({ success: false, message: "Not Authorized" }, { status: 403 });
    }

    await connectDb();
    const product = await Product.findById(params.id);
    if (!product) {
        return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // Ensure the seller owns the product
    if (product.userId.toString() !== userId) {
        return NextResponse.json({ success: false, message: "Not authorized to edit this product" }, { status: 403 });
    }

    try {
        const formData = await request.formData();
        const updateData = {};
        
        // Basic fields
        if (formData.has('name')) updateData.name = formData.get('name');
        if (formData.has('description')) updateData.description = formData.get('description');
        if (formData.has('additionalInfo')) updateData.additionalInfo = formData.get('additionalInfo');
        if (formData.has('category')) updateData.category = formData.get('category');
        if (formData.has('price')) updateData.price = Number(formData.get('price'));
        if (formData.has('offerPrice')) updateData.offerPrice = Number(formData.get('offerPrice'));

        // Handle colors
        if (formData.has('colors')) {
            updateData.colors = JSON.parse(formData.get('colors'));
        }

        // Handle new product images
        const newImages = formData.getAll('images');
        if (newImages.length > 0) {
            const imageUrls = await Promise.all(
                newImages.map(async (file) => {
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    const result = await uploadToCloudinary(buffer);
                    return result.secure_url;
                })
            );
            // This replaces all images. A more complex logic would be needed to add/remove specific images.
            updateData.image = imageUrls;
        }
        
        // Handle new color images
        const colorImages = product.colorImages || {};
        for (const color of updateData.colors || product.colors) {
            const colorFile = formData.get(`colorImages[${color}]`);
            if (colorFile) {
                const arrayBuffer = await colorFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const result = await uploadToCloudinary(buffer);
                colorImages[color] = result.secure_url;
            }
        }
        updateData.colorImages = colorImages;

        const updatedProduct = await Product.findByIdAndUpdate(params.id, updateData, { new: true });

        return NextResponse.json({ success: true, message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ success: false, message: "Error updating product" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Not authenticated" });
        }

        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not Authorized" });
        }

        await connectDb();
        const product = await Product.findById(params.id);

        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" });
        }
        
        // Optional: Verify that the user deleting the product is the one who created it
        if (product.userId.toString() !== userId) {
            return NextResponse.json({ success: false, message: "Not authorized to delete this product" });
        }
        
        // Delete images from Cloudinary
        const imagePublicIds = product.image.map(url => url.split('/').pop().split('.')[0]);
        if (imagePublicIds.length > 0) {
            await cloudinary.api.delete_resources(imagePublicIds);
        }

        await Product.findByIdAndDelete(params.id);

        return NextResponse.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ success: false, message: "Error deleting product" });
    }
} 