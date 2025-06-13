import connectDb from "@/config/db";
import Address from "@/models/Address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
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

        const { address } = await request.json();
        
        // Fix 3: Validate address data
        if (!address) {
            return NextResponse.json({
                success: false, 
                message: "Address data is required"
            }, { status: 400 });
        }

        await connectDb();
        const newAddress = await Address.create({ ...address, userId });

        return NextResponse.json({
            success: true, 
            message: "Address added successfully", // Fixed typo: "cart" -> "successfully"
            newAddress
        });
    } catch (error) {
        console.error("Error adding address:", error);
        return NextResponse.json({
            success: false, 
            message: error.message
        }, { status: 500 });
    }
}