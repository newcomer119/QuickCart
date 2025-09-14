/**
 * Test Shiprocket API Connection
 * This route tests the Shiprocket integration
 */

import { testConnection } from '@/lib/shiprocket';

export async function GET() {
    try {
        console.log('Testing Shiprocket connection...');
        
        const result = await testConnection();
        
        if (result.success) {
            return Response.json({
                success: true,
                message: result.message,
                token: result.token,
                timestamp: new Date().toISOString()
            });
        } else {
            return Response.json({
                success: false,
                message: result.message,
                timestamp: new Date().toISOString()
            }, { status: 500 });
        }
    } catch (error) {
        console.error('Shiprocket test error:', error);
        return Response.json({
            success: false,
            message: `Test failed: ${error.message}`,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
