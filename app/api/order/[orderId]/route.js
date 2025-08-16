import { NextResponse } from 'next/server';
import connectDb from '@/config/db';
import Order from '@/models/Order';
import User from '@/models/Users';
import { getAuth } from '@clerk/nextjs/server';
import authSeller from "@/lib/authSeller";

export async function DELETE(request, { params }) {
    try {
        const { userId } = getAuth(request);
        const { orderId } = params;

        await connectDb();

        // Find the order and verify it belongs to the user
        const order = await Order.findOne({ _id: orderId, userId });
        
        if (!order) {
            return NextResponse.json({
                success: false,
                message: "Order not found or unauthorized"
            });
        }

        // Only allow deletion of pending orders
        if (order.paymentStatus !== 'PENDING') {
            return NextResponse.json({
                success: false,
                message: "Cannot delete completed orders"
            });
        }

        // Delete the order
        await Order.findByIdAndDelete(orderId);

        return NextResponse.json({
            success: true,
            message: "Order deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting order:", error);
        return NextResponse.json({
            success: false,
            message: error.message
        });
    }
} 

export async function GET(request, { params }) {
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

        // Add user email and name to the order object for easy access
        const orderWithUserData = {
            ...order.toObject(),
            userEmail: userEmail,
            userName: userName
        };

        return NextResponse.json({ 
            success: true, 
            order: orderWithUserData 
        });

    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        });
    }
} 