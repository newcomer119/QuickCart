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
            .select('customOrderId items address amount subtotal gst deliveryCharges discount paymentMethod paymentStatus status date');
        
        // Handle backward compatibility for existing orders
        const ordersWithDefaults = orders.map(order => ({
            ...order.toObject(),
            subtotal: order.subtotal || (order.amount ? Math.round(order.amount / 1.18) : 0),
            gst: order.gst || (order.amount ? Math.round(order.amount - (order.amount / 1.18)) : 0),
            deliveryCharges: order.deliveryCharges || 0,
            discount: order.discount || 0
        }));
        
        return NextResponse.json({ success : true, orders: ordersWithDefaults})

    } catch (error) {
        return NextResponse.json({ success : false, message : error.message})
    }
}