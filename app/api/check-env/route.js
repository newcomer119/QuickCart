import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        const publicKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

        return NextResponse.json({
            success: true,
            data: {
                hasKeyId: !!keyId,
                keyIdLength: keyId?.length,
                hasKeySecret: !!keySecret,
                keySecretLength: keySecret?.length,
                hasPublicKey: !!publicKey,
                publicKeyLength: publicKey?.length
            }
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        });
    }
} 