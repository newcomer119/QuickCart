import { generateCustomOrderId } from "@/lib/orderIdGenerator";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log('Testing generateCustomOrderId function...');
        
        const customOrderId = await generateCustomOrderId();
        
        console.log('Test result:', customOrderId);
        
        return NextResponse.json({ 
            success: true, 
            customOrderId,
            type: typeof customOrderId,
            length: customOrderId.length
        });
    } catch (error) {
        console.error('Test failed:', error);
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        });
    }
}
