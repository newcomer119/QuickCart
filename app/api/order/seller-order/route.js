import connectDb from "@/config/db";
import authSeller from "@/lib/authSeller";
import Order from "@/models/Order";
import Address from "@/models/Address";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not authorized" });
        }

        await connectDb();
        
        const orders = await Order.find({}).populate('address items.product')
        return NextResponse.json({ success : true, orders})

    } catch (error) {
        return NextResponse.json({ success : false, message : error.message})
    }
}