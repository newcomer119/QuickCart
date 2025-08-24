import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/Users";
import { getAuth } from "@clerk/nextjs/server";
import NextResponse from "next/server";
import connectDb from "@/config/db";
import Order from "@/models/Order";
import mongoose from "mongoose";
import { generateCustomOrderId } from "@/lib/orderIdGenerator";

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

export async function POST(request) {
    try {
        console.log('Starting order creation process...');
        
        await connectDb();
        console.log('Database connected successfully');
        
        // Verify Order model is available
        console.log('Order model available:', !!Order);
        console.log('Order model name:', Order.modelName);
        
        const { userId } = getAuth(request)
        console.log('User ID from auth:', userId);
        
        const { address, items, paymentMethod, paymentId, orderId, signature, couponCode, discount } = await request.json()
        console.log('Request data received:', { address, itemsCount: items?.length, paymentMethod, couponCode, discount });

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid Data' })
        }

        // calculate amount using items
        let subtotal = 0;
        console.log('Starting subtotal calculation for', items.length, 'items');
        
        for (const item of items) {
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
            const itemTotal = product.offerPrice * item.quantity;
            subtotal += itemTotal;
            console.log(`Item: ${product.name}, Price: ${product.offerPrice}, Qty: ${item.quantity}, Total: ${itemTotal}, Running subtotal: ${subtotal}`);
        }

        console.log('Final subtotal calculated:', subtotal);

        // Ensure subtotal is a valid number
        if (typeof subtotal !== 'number' || isNaN(subtotal)) {
            throw new Error('Invalid subtotal calculation - subtotal is not a number');
        }

        // Calculate payment breakdown
        const discountAmount = discount || 0;
        const discountedSubtotal = subtotal - discountAmount; // Apply discount to subtotal first
        const gst = Math.floor(discountedSubtotal * 0.18); // Calculate GST on discounted amount
        const deliveryCharges = 0; // Free delivery for now
        const totalAmount = discountedSubtotal + gst + deliveryCharges; // Total = discounted subtotal + GST + delivery

        console.log('Payment breakdown calculation:', {
            originalSubtotal: subtotal,
            discountAmount,
            discountedSubtotal,
            gst,
            deliveryCharges,
            totalAmount
        });

        // Validate calculations
        if (isNaN(subtotal) || subtotal < 0) {
            throw new Error('Invalid subtotal calculation');
        }
        if (isNaN(discountedSubtotal) || discountedSubtotal < 0) {
            throw new Error('Invalid discounted subtotal calculation');
        }
        if (isNaN(totalAmount) || totalAmount < 0) {
            throw new Error('Invalid total amount calculation');
        }

        // Get user details for email
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' });
        }

        // Generate custom order ID
        let customOrderId;
        try {
            customOrderId = await generateCustomOrderId();
            console.log('Generated custom order ID:', customOrderId);
        } catch (error) {
            console.error('Error generating custom order ID:', error);
            // Fallback to timestamp-based ID if generation fails
            customOrderId = `ORDER-${Date.now()}`;
        }

        // Ensure we have a valid customOrderId
        if (!customOrderId) {
            customOrderId = `ORDER-${Date.now()}`;
        }

        console.log('Final customOrderId:', customOrderId);

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

        // Debug logging
        console.log('Order data being created:', {
            customOrderId,
            subtotal: discountedSubtotal,
            amount: totalAmount,
            gst,
            deliveryCharges,
            discount: discountAmount,
            userId,
            address,
            items: items.length
        });

        // Validate order data before creation
        if (!customOrderId || !userId || !address || !items || items.length === 0) {
            throw new Error('Missing required order data');
        }

        if (typeof discountedSubtotal !== 'number' || discountedSubtotal < 0) {
            throw new Error('Invalid subtotal value');
        }

        if (typeof totalAmount !== 'number' || totalAmount < 0) {
            throw new Error('Invalid total amount value');
        }

        // Additional validation for required fields
        if (!customOrderId || typeof customOrderId !== 'string') {
            throw new Error('Invalid customOrderId');
        }

        if (!userId || typeof userId !== 'string') {
            throw new Error('Invalid userId');
        }

        if (!address || typeof address !== 'string') {
            throw new Error('Invalid address');
        }

        if (!Array.isArray(items) || items.length === 0) {
            throw new Error('Invalid items array');
        }

        // Log the final order data for debugging
        console.log('Final order data validation:', {
            customOrderId: !!customOrderId,
            userId: !!userId,
            address: !!address,
            itemsCount: items.length,
            subtotal: discountedSubtotal,
            amount: totalAmount,
            gst: gst,
            deliveryCharges: deliveryCharges,
            discount: discountAmount
        });

        if (paymentMethod === 'ONLINE') {
            // For online payment, create completed order with payment details
            orderData.paymentStatus = 'COMPLETED';
            orderData.status = 'Order Placed';
            orderData.razorpayOrderId = orderId;
            orderData.razorpayPaymentId = paymentId;
        } else {
            // For COD, create completed order
            orderData.paymentStatus = 'COMPLETED';
            orderData.status = 'Order Placed';
        }

        console.log('About to create order with data:', orderData);

        let order;
        try {
            order = await Order.create(orderData);
            console.log('Order created successfully:', order._id);
        } catch (createError) {
            console.error('Error creating order in database:', createError);
            if (createError.errors) {
                console.error('Validation errors:', createError.errors);
            }
            throw createError;
        }

        // clear user cart for all completed orders
        user.cartItems = {}
        await user.save()

        await inngest.send({
            name: "order/created",
            data: {
                customOrderId,
                userId,
                address,
                items,
                amount: totalAmount,
                subtotal: discountedSubtotal, // Use discountedSubtotal, not subtotal
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
            order
        })

    } catch (error) {
        console.error("Error creating order:", error)
        
        // Log detailed error information
        if (error.errors) {
            console.error("Validation errors:", error.errors);
        }
        if (error.message) {
            console.error("Error message:", error.message);
        }
        
        return NextResponse.json({ 
            success: false, 
            message: error.message || 'Failed to create order',
            details: error.errors || {}
        })
    }
}