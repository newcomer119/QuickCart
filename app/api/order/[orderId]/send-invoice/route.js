import connectDb from "@/config/db";
import authSeller from "@/lib/authSeller";
import Order from "@/models/Order";
import User from "@/models/Users";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not authorized" });
        }

        const { orderId } = params;

        if (!orderId) {
            return NextResponse.json({ success: false, message: "Order ID is required" });
        }

        await connectDb();
        
        // Find order and populate related data
        const order = await Order.findById(orderId)
            .populate('address')
            .populate('items.product');

        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found" });
        }

        // Fetch user data separately since userId is a String
        let userEmail = 'N/A';
        let userName = 'N/A';
        
        if (order.userId) {
            try {
                const user = await User.findById(order.userId);
                if (user) {
                    userEmail = user.email || 'N/A';
                    userName = user.name || 'N/A';
                }
            } catch (userError) {
                console.error("Error fetching user:", userError);
            }
        }

        // TODO: Implement EmailJS service call here
        // This is where you'll add your EmailJS service to send GST invoice
        // You now have access to userEmail and userName for the invoice
        
        // For now, return success
        return NextResponse.json({ 
            success: true, 
            message: "GST Invoice sent successfully" 
        });

    } catch (error) {
        console.error("Error sending GST invoice:", error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        });
    }
}
