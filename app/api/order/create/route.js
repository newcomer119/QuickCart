import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/Users";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDb from "@/config/db";
import Order from "@/models/Order";
import { sendOrderConfirmationEmail } from "@/lib/emailjs";
import Address from "@/models/Address";

export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const { address, items, paymentMethod } = await request.json()

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid Data' })
        }

        // calculate amount using items
        const amount = await items.reduce(async (acc, item) => {
            const productId = item.product.split('_')[0];
            const product = await Product.findById(productId);
            return await acc + product.offerPrice * item.quantity
        }, 0)

        const totalAmount = amount + Math.floor(amount * 0.02);

        await connectDb();
        
        // Get user details for email
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' });
        }

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
        user.cartItems = {}
        await user.save()

        // Get product details for email
        const itemsWithDetails = await Promise.all(items.map(async (item) => {
            const productId = item.product.split('_')[0];
            const product = await Product.findById(productId);
            return {
                name: product.name,
                quantity: item.quantity,
                price: product.offerPrice
            };
        }));

        // Get full address details
        const addressDetails = await Address.findById(address);
        const formattedAddress = addressDetails ? 
            `${addressDetails.fullName}, ${addressDetails.area}, ${addressDetails.city}, ${addressDetails.state}, ${addressDetails.pincode}` 
            : 'Address not found';

        // Prepare order details for email
        const orderDetails = {
            email: user.email,
            orderNumber: order._id,
            totalAmount,
            items: itemsWithDetails,
            shippingAddress: formattedAddress,
            paymentMethod
        };

        // Send order confirmation email
        try {
            console.log('Preparing to send order confirmation email...');
            console.log('User email:', user.email);
            console.log('Order details:', orderDetails);

            const emailResult = await sendOrderConfirmationEmail(orderDetails);

            console.log('Email sending result:', emailResult);

            if (!emailResult.success) {
                console.error('Failed to send email:', emailResult.error);
            }
        } catch (emailError) {
            console.error('Error in email sending:', emailError);
            console.error('Error stack:', emailError.stack);
        }

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
            order,
            orderDetails
        })

    } catch (error) {
        console.error("Error creating order:", error)
        return NextResponse.json({ success: false, message: error.message })
    }
}