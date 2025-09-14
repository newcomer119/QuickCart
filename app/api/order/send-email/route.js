import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDb from "@/config/db";
import Order from "@/models/Order";
import User from "@/models/Users";
import Product from "@/models/Product";
import Address from "@/models/Address";

export async function POST(request) {
    try {
        await connectDb();
        const { userId } = getAuth(request);
        const { orderId } = await request.json();

        if (!orderId) {
            return NextResponse.json({ success: false, message: 'Order ID is required' });
        }

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' });
        }

        // Get user details
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' });
        }

        // Get product details
        const itemsWithDetails = await Promise.all(order.items.map(async (item) => {
            const product = await Product.findById(item.product);
            return {
                name: product?.name || 'Product',
                quantity: item.quantity,
                price: product?.offerPrice || 0,
                color: item.color || null
            };
        }));

        // Get address details
        const addressDetails = await Address.findById(order.address);
        const formattedAddress = addressDetails ? 
            `${addressDetails.fullName}, ${addressDetails.area}, ${addressDetails.city}, ${addressDetails.state}, ${addressDetails.pincode}` 
            : 'Address not found';

        // Prepare order details for email
        const orderDetails = {
            email: user.email,
            orderNumber: order.customOrderId,
            totalAmount: order.amount,
            subtotal: order.subtotal,
            gst: order.gst,
            deliveryCharges: order.deliveryCharges,
            discount: order.discount,
            items: itemsWithDetails,
            shippingAddress: formattedAddress,
            paymentMethod: order.paymentMethod
        };

        return NextResponse.json({ 
            success: true, 
            message: 'Order details retrieved successfully',
            orderDetails
        });

    } catch (error) {
        console.error("Error retrieving order details for email:", error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || 'Failed to retrieve order details'
        });
    }
}
