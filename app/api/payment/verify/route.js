import crypto from 'crypto';
import { NextResponse } from 'next/server';
import connectDb from '@/config/db';
import Order from '@/models/Order';
import User from '@/models/Users';

export async function POST(request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await request.json();

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            await connectDb();
            
            // Update order in database
            const order = await Order.findById(orderId);
            if (!order) {
                return NextResponse.json({
                    success: false,
                    message: "Order not found"
                });
            }

            // Update order status
            order.paymentStatus = 'COMPLETED';
            order.status = 'Order Placed';
            order.razorpayOrderId = razorpay_order_id;
            order.razorpayPaymentId = razorpay_payment_id;
            await order.save();

            // Clear user's cart after successful payment
            const user = await User.findById(order.userId);
            if (user) {
                user.cartItems = {};
                await user.save();
            }

            return NextResponse.json({
                success: true,
                message: "Payment verified successfully"
            });
        } else {
            // If payment verification fails, delete the pending order
            await connectDb();
            await Order.findByIdAndDelete(orderId);

            return NextResponse.json({
                success: false,
                message: "Payment verification failed"
            });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json({
            success: false,
            message: error.message
        });
    }
} 