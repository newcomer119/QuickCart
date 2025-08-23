import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/Users";
import { getAuth } from "@clerk/nextjs/server";
import NextResponse from "next/server";
import connectDb from "@/config/db";
import Order from "@/models/Order";
import { sendOrderConfirmationEmail } from "@/lib/emailjs";
import Address from "@/models/Address";
import mongoose from "mongoose";
import { generateCustomOrderId } from "@/lib/orderIdGenerator";

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

export async function POST(request) {
    try {
        await connectDb();
        const { userId } = getAuth(request)
        const { address, items, paymentMethod, paymentId, orderId, signature, couponCode, discount } = await request.json()

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid Data' })
        }

        // calculate amount using items
        const subtotal = await items.reduce(async (acc, item) => {
            // Extract productId if item.product contains an underscore
            let productId = item.product;
            if (typeof productId === 'string' && productId.includes('_')) {
                productId = productId.split('_')[0];
            }
            if (!isValidObjectId(productId)) {
                throw new Error(`Invalid product id: ${productId}`);
            }
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error(`Product not found for id: ${productId}`);
            }
            return await acc + product.offerPrice * item.quantity
        }, 0)

        // Calculate payment breakdown
        const discountAmount = discount || 0;
        const discountedSubtotal = subtotal - discountAmount; // Apply discount to subtotal first
        const gst = Math.floor(discountedSubtotal * 0.18); // Calculate GST on discounted amount
        const deliveryCharges = 0; // Free delivery for now
        const totalAmount = discountedSubtotal + gst + deliveryCharges; // Total = discounted subtotal + GST + delivery

        // Get user details for email
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' });
        }

        // Generate custom order ID
        let customOrderId;
        try {
            customOrderId = await generateCustomOrderId();
            
            // Verify the generated ID is unique
            const existingOrder = await Order.findOne({ customOrderId });
            if (existingOrder) {
                // If duplicate, generate a new one with timestamp
                customOrderId = `ORDER-${Date.now()}`;
            }
        } catch (error) {
            console.error('Error generating custom order ID:', error);
            // Fallback to timestamp-based ID if generation fails
            customOrderId = `ORDER-${Date.now()}`;
        }

        // Create order with appropriate status based on payment method
        let orderData = {
            customOrderId,
            userId,
            address,
            items,
            amount: totalAmount,
            subtotal: discountedSubtotal, // Store the discounted subtotal
            gst: gst,
            deliveryCharges: deliveryCharges,
            discount: discountAmount,
            paymentMethod,
            date: Date.now(),
            data: { items, address, paymentMethod, couponCode, discount }
        };

        if (paymentMethod === 'ONLINE') {
            // For online payment, create completed order with payment details
            orderData.paymentStatus = 'COMPLETED';
            orderData.status = 'Order Placed';
            orderData.paymentDetails = {
                paymentId,
                orderId,
                signature
            };
        } else {
            // For COD, create completed order
            orderData.paymentStatus = 'COMPLETED';
            orderData.status = 'Order Placed';
        }

        const order = await Order.create(orderData);

        // clear user cart for all completed orders
        user.cartItems = {}
        await user.save()

        // Get product details for email
        const itemsWithDetails = await Promise.all(items.map(async (item) => {
            // Extract productId if item.product contains an underscore
            let productId = item.product;
            if (typeof productId === 'string' && productId.includes('_')) {
                productId = productId.split('_')[0];
            }
            if (!isValidObjectId(productId)) {
                throw new Error(`Invalid product id: ${productId}`);
            }
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error(`Product not found for id: ${productId}`);
            }
            return {
                name: product.name,
                quantity: item.quantity,
                price: product.offerPrice,
                color: item.color || null
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
            orderNumber: customOrderId, // Use custom order ID instead of MongoDB _id
            totalAmount,
            subtotal: subtotal,
            gst: gst,
            deliveryCharges: deliveryCharges,
            discount: discountAmount,
            items: itemsWithDetails,
            shippingAddress: formattedAddress,
            paymentMethod
        };

        // Send order confirmation email
        try {
            const emailResult = await sendOrderConfirmationEmail(orderDetails);

            if (!emailResult.success) {
                console.error('Failed to send email:', emailResult.error);
            }
        } catch (emailError) {
            console.error('Error in email sending:', emailError);
        }

        await inngest.send({
            name: "order/created",
            data: {
                customOrderId,
                userId,
                address,
                items,
                amount: totalAmount,
                subtotal: subtotal,
                gst: gst,
                deliveryCharges: deliveryCharges,
                discount: discountAmount,
                paymentMethod,
                date: Date.now()
            }
        })

        return NextResponse.json({ 
            success: true, 
            message: paymentMethod === 'ONLINE' ? "Order Placed Successfully" : "Order Placed",
            order,
            orderDetails
        })

    } catch (error) {
        console.error("Error creating order:", error)
        return NextResponse.json({ success: false, message: error.message })
    }
}