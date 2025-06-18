import connectDb from "@/config/db";
import authSeller from "@/lib/authSeller";
import DesignRequest from "@/models/DesignRequest";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    try {
        const { userId } = getAuth(request);
        const { id } = params;
        const { status, quote, estimatedDelivery, adminNotes } = await request.json();
        
        if (!userId) {
            return NextResponse.json({ success: false, message: "Not authenticated" });
        }

        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not Authorized" });
        }

        await connectDb();
        
        const updateData = { status };
        
        // Add optional fields if provided
        if (quote !== undefined) updateData.quote = quote;
        if (estimatedDelivery !== undefined) updateData.estimatedDelivery = estimatedDelivery;
        if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

        const updatedRequest = await DesignRequest.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedRequest) {
            return NextResponse.json({ 
                success: false, 
                message: "Design request not found" 
            }, { status: 404 });
        }

        return NextResponse.json({ 
            success: true, 
            message: "Status updated successfully",
            designRequest: updatedRequest
        });

    } catch (error) {
        console.error("Error updating design request status:", error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || "Error updating status" 
        }, { status: 500 });
    }
} 