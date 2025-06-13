import connectDb from "@/config/db";
import Address from "@/models/Address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        // Fix 1: Pass the request object to getAuth
        const { userId } = getAuth(request);
        
        // Fix 2: Check if userId exists
        if (!userId) {
            return NextResponse.json({
                success: false, 
                message: "Unauthorized - User not authenticated"
            }, { status: 401 });
        }

        await connectDb();
        const addresses = await Address.find({ userId });
        
        return NextResponse.json({
            success: true, 
            addresses
        });
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return NextResponse.json({
            success: false, 
            message: error.message
        }, { status: 500 });
    }
}