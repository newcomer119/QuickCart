import connectDb from "@/config/db";
import authSeller from "@/lib/authSeller";
import Order from "@/models/Order";
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
        
        const orders = await Order.find({})
            .populate({
                path: 'items.product',
                model: 'Product'
            })
            .populate({
                path: 'address',
                model: 'Address'
            });

        return NextResponse.json({ success: true, orders });

    } catch (error) {
        console.error("Error fetching seller orders:", error);
        return NextResponse.json({ success: false, message: error.message });
    }
}