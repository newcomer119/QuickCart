import connectDb from "@/config/db";
import authSeller from "@/lib/authSeller";
import DesignRequest from "@/models/DesignRequest";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
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
        
        const designRequests = await DesignRequest.find({})
            .sort({ date: -1 }) // Sort by date, newest first
            .lean();

        return NextResponse.json({ 
            success: true, 
            designRequests 
        });

    } catch (error) {
        console.error("Error fetching design requests:", error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || "Error fetching design requests" 
        }, { status: 500 });
    }
} 