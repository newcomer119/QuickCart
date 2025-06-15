import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/Users";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDb from "@/config/db";
import Order from "@/models/Order";

export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const { address, items, paymentMethod } = await request.json()

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid Data' })
        }

        // calculate amount using items
        const amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product)
            return await acc + product.offerPrice * item.quantity
        }, 0)

        const totalAmount = amount + Math.floor(amount * 0.02);

        await connectDb();
        
        // For online payment, create a pending order
        if (paymentMethod === 'ONLINE') {
            const order = await Order.create({
                userId,
                address,
                items,
                amount: totalAmount,
                paymentMethod,
                paymentStatus: 'PENDING',
                status: 'PENDING',
                date: Date.now(),
                data: { items, address, paymentMethod }
            });

            return NextResponse.json({ 
                success: true, 
                message: "Order created pending payment",
                order
            })
        }
        
        // For COD, create a completed order
        const order = await Order.create({
            userId,
            address,
            items,
            amount: totalAmount,
            paymentMethod,
            paymentStatus: 'COMPLETED',
            status: 'Order Placed',
            date: Date.now(),
            data: { items, address, paymentMethod }
        });

        // clear user cart only for COD orders
        const user = await User.findById(userId)
        user.cartItems = {}
        await user.save()

        await inngest.send({
            name: "order/created",
            data: {
                userId,
                address,
                items,
                amount: totalAmount,
                paymentMethod,
                date: Date.now()
            }
        })

        return NextResponse.json({ 
            success: true, 
            message: "Order Placed",
            order
        })

    } catch (error) {
        console.error("Error creating order:", error)
        return NextResponse.json({ success: false, message: error.message })
    }
}