import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDb from "@/config/db";
import DesignRequest from "@/models/DesignRequest";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' });
        }

        const formData = await request.formData();
        const file = formData.get('file');
        const designName = formData.get('designName');
        const description = formData.get('description');
        const material = formData.get('material');
        const color = formData.get('color');
        const quantity = parseInt(formData.get('quantity'));
        const specialRequirements = formData.get('specialRequirements');

        // Validate required fields
        if (!file || !designName) {
            return NextResponse.json({ success: false, message: 'Design file and name are required' });
        }

        // Validate file type
        const allowedTypes = ['.stl', '.3mf', '.gcode'];
        const fileName = file.name.toLowerCase();
        const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
        
        if (!allowedTypes.includes(fileExtension)) {
            return NextResponse.json({ success: false, message: 'Invalid file type. Please upload .stl, .3mf, or .gcode files' });
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ success: false, message: 'File size should be less than 10MB' });
        }

        await connectDb();

        // Create unique filename
        const timestamp = Date.now();
        const uniqueFileName = `${userId}_${timestamp}_${fileName}`;
        
        // Convert file to buffer
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        
        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'raw',
                    public_id: `designs/${uniqueFileName}`,
                    format: fileExtension.substring(1), // Remove the dot
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(fileBuffer);
        });

        // Create design request in database
        const designRequest = await DesignRequest.create({
            userId,
            designName,
            description,
            material,
            color,
            quantity,
            specialRequirements,
            fileName: uniqueFileName,
            fileUrl: uploadResult.secure_url,
            status: 'PENDING',
            date: Date.now()
        });

        return NextResponse.json({
            success: true,
            message: 'Design request submitted successfully',
            designRequest
        });

    } catch (error) {
        console.error('Error creating design request:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || 'Error submitting design request' 
        });
    }
}