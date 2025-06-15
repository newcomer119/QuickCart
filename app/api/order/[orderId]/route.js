import { NextResponse } from 'next/server';
import connectDb from '@/config/db';
import Order from '@/models/Order';
import { getAuth } from '@clerk/nextjs/server';

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