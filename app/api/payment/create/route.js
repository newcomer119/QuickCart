import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
    try {
        const { amount } = await request.json();

        if (!amount) {
            return NextResponse.json({
                success: false,
                message: "Amount is required"
            });
        }

        const options = {
            amount: Math.round(amount * 100), // amount in smallest currency unit (paise for INR)
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };

        // Check if API keys are configured
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        
        if (!keyId || !keySecret) {
            throw new Error('Razorpay API keys are not properly configured');
        }

        const authString = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

        // Create order using Razorpay REST API
        const response = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${authString}`
            },
            body: JSON.stringify(options)
        });

        const order = await response.json();

        if (!response.ok) {
            throw new Error(`Razorpay API error: ${order.error?.description || 'Unknown error'}`);
        }

        if (!order.id) {
            throw new Error('Failed to create Razorpay order: No order ID in response');
        }

        return NextResponse.json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Failed to create payment order"
        });
    }
} 