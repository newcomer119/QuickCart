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

export async function POST(request) {
    try {
        console.log("Starting product upload process..."); // Debug log

        const { userId } = getAuth(request);
        console.log("User ID:", userId); // Debug log

        if (!userId) {
            console.log("No user ID found"); // Debug log
            return NextResponse.json({ success: false, message: "Not authenticated" });
        }

        const isSeller = await authSeller(userId);
        console.log("Is seller:", isSeller); // Debug log

        if (!isSeller) {
            console.log("User is not a seller"); // Debug log
            return NextResponse.json({ success: false, message: "Not Authorized" });
        }

        const formData = await request.formData();
        console.log("Form data received"); // Debug log

        const name = formData.get('name');
        const description = formData.get('description');
        const additionalInfo = formData.get('additionalInfo');
        const category = formData.get('category');
        const colorsJson = formData.get('colors');
        const price = formData.get('price');
        const offerPrice = formData.get('offerPrice');
        const files = formData.getAll('images');

        console.log("Files received:", files.length); // Debug log
        console.log("Product details:", { name, description, category, colors: colorsJson, price, offerPrice }); // Debug log

        if (!files || files.length === 0) {
            console.log("No files found in request"); // Debug log
            return NextResponse.json({ success: false, message: "No files uploaded" });
        }

        // Parse colors from JSON string
        let colors = [];
        try {
            colors = JSON.parse(colorsJson);
        } catch (error) {
            console.log("Error parsing colors JSON"); // Debug log
            return NextResponse.json({ 
                success: false, 
                message: "Invalid colors data" 
            }, { status: 400 });
        }

        // Validate required fields
        if (!name || !description || !category || !colors || colors.length === 0 || !price || !offerPrice) {
            console.log("Missing required fields"); // Debug log
            return NextResponse.json({ 
                success: false, 
                message: "All fields are required and at least one color must be selected" 
            }, { status: 400 });
        }

        console.log("Uploading files to Cloudinary..."); // Debug log
        const result = await Promise.all(
            files.map(async (file) => {
                try {
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    return new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            { resource_type: 'auto' },
                            (error, result) => {
                                if (error) {
                                    console.error("Cloudinary upload error:", error);
                                    reject(error);
                                } else {
                                    console.log("File uploaded successfully:", result.secure_url); // Debug log
                                    resolve(result);
                                }
                            }
                        );
                        stream.end(buffer);
                    });
                } catch (error) {
                    console.error("Error processing file:", error);
                    throw error;
                }
            })
        );

        const images = result.map(result => result.secure_url);
        console.log("All files uploaded successfully"); // Debug log

        // Handle color images
        const colorImages = {};
        for (const color of colors) {
            const colorFile = formData.get(`colorImages[${color}]`);
            if (colorFile) {
                try {
                    const arrayBuffer = await colorFile.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    const uploadResult = await new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            { resource_type: 'auto' },
                            (error, result) => {
                                if (error) reject(error);
                                else resolve(result);
                            }
                        );
                        stream.end(buffer);
                    });
                    colorImages[color] = uploadResult.secure_url;
                } catch (error) {
                    console.error(`Error uploading color image for ${color}:`, error);
                    colorImages[color] = null;
                }
            } else {
                colorImages[color] = null;
            }
        }

        await connectDb();
        console.log("Database connected"); // Debug log

        console.log("About to create product with colors:", colors); // Debug log - show colors array
        console.log("Colors type:", typeof colors); // Debug log - show colors type
        console.log("Colors length:", colors.length); // Debug log - show colors length

        const newProduct = await Product.create({
            userId,
            name,
            description,
            additionalInfo,
            category,
            colors,
            colorImages,
            price: Number(price),
            offerPrice: Number(offerPrice),
            image: images,
            date: Date.now()
        });

        console.log("Product created successfully:", newProduct._id); // Debug log
        console.log("Created product data:", JSON.stringify(newProduct, null, 2)); // Debug log - show full product data

        return NextResponse.json({ 
            success: true, 
            message: "Product uploaded successfully",
            product: newProduct
        });

    } catch (error) {
        console.error("Error in product upload:", error);
        // Log the full error stack
        console.error("Error stack:", error.stack);
        
        return NextResponse.json({ 
            success: false, 
            message: error.message || "Error uploading product",
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}