import connectDb from "@/config/db";
import authSeller from "@/lib/authSeller";
import DesignRequest from "@/models/DesignRequest";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request, context) {
    try {
        const { userId } = getAuth(request);
        
        // Extract id from context params
        const id = context?.params?.id;
        
        if (!id) {
            return NextResponse.json({ 
                success: false, 
                message: "Invalid request: Missing design request ID" 
            }, { status: 400 });
        }
        
        if (!userId) {
            return NextResponse.json({ success: false, message: "Not authenticated" });
        }

        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not Authorized" });
        }

        await connectDb();
        
        const designRequest = await DesignRequest.findById(id);
        
        if (!designRequest) {
            return NextResponse.json({ 
                success: false, 
                message: "Design request not found" 
            }, { status: 404 });
        }

        // Check if we have a Cloudinary URL
        if (designRequest.fileUrl) {
            return NextResponse.redirect(designRequest.fileUrl);
        }

        return NextResponse.json({ 
            success: false, 
            message: "No file URL found" 
        }, { status: 404 });

    } catch (error) {
        console.error("Error downloading file:", error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || "Error downloading file" 
        }, { status: 500 });
    }
} 