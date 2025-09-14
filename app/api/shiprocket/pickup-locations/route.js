/**
 * Get Pickup Locations from Shiprocket
 * This route fetches available pickup locations from Shiprocket
 */

import { getPickupLocations } from '@/lib/shiprocket';
import connectDb from '@/config/db';

export async function GET() {
    try {
        await connectDb();
        
        console.log('Fetching pickup locations from Shiprocket...');
        
        // Get pickup locations from Shiprocket
        const pickupLocations = await getPickupLocations();
        
        console.log('Pickup locations fetched:', pickupLocations);
        
        return Response.json({
            success: true,
            message: 'Pickup locations fetched successfully',
            data: pickupLocations
        });
        
    } catch (error) {
        console.error('Error fetching pickup locations:', error);
        
        return Response.json({
            success: false,
            message: `Failed to fetch pickup locations: ${error.message}`,
            error: error.message
        }, { status: 500 });
    }
}
