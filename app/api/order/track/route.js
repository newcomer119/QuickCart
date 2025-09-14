/**
 * Track Order API
 * This route provides order tracking information including shipment status
 */

import Order from '@/models/Order';
import User from '@/models/Users';
import { trackShipment } from '@/lib/shiprocket';
import connectDb from '@/config/db';

export async function GET(request) {
    try {
        await connectDb();
        
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('orderId');
        const trackingId = searchParams.get('trackingId');
        
        if (!orderId && !trackingId) {
            return Response.json({
                success: false,
                message: 'Order ID or Tracking ID is required'
            }, { status: 400 });
        }

        let order;
        
        // Find order by ID or tracking ID
        if (orderId) {
            order = await Order.findById(orderId).populate('address').populate('items.product');
        } else if (trackingId) {
            order = await Order.findOne({
                $or: [
                    { customOrderId: trackingId },
                    { shiprocketAWB: trackingId }
                ]
            }).populate('address').populate('items.product');
        }

        // Get user information
        let user = null;
        if (order && order.userId) {
            user = await User.findById(order.userId);
            console.log('User found:', user ? { name: user.name, email: user.email } : 'No user found');
        }
        
        console.log('Order address:', order.address ? {
            fullName: order.address.fullName,
            area: order.address.area,
            phoneNumber: order.address.phoneNumber
        } : 'No address found');

        if (!order) {
            return Response.json({
                success: false,
                message: 'Order not found'
            }, { status: 404 });
        }

        // Get real-time tracking data from Shiprocket if available
        let shiprocketTracking = null;
        if (order.shiprocketAWB) {
            try {
                shiprocketTracking = await trackShipment(order.shiprocketAWB);
            } catch (error) {
                console.log('Could not fetch Shiprocket tracking data:', error.message);
                // Continue without Shiprocket data
            }
        }

        // Prepare tracking response
        const trackingData = {
            orderId: order._id,
            customOrderId: order.customOrderId,
            status: order.status,
            orderDate: order.date,
            totalAmount: order.amount,
            paymentMethod: order.paymentMethod,
            
            // Customer details
            customer: {
                name: user ? user.name : 'N/A',
                email: user ? user.email : 'N/A',
                phone: 'N/A' // User model doesn't have phone field
            },
            
            // Address details
            address: order.address ? {
                name: order.address.fullName,
                address: order.address.area,
                city: order.address.city,
                state: order.address.state,
                pincode: order.address.pincode,
                phone: order.address.phoneNumber
            } : null,
            
            // Shipment details
            shipment: {
                status: order.shipmentStatus || 'PENDING',
                awb: order.shiprocketAWB || '',
                courierName: order.courierName || '',
                trackingUrl: order.trackingUrl || '',
                shipmentId: order.shipmentId || '',
                pickupScheduledDate: order.pickupScheduledDate,
                expectedDeliveryDate: order.expectedDeliveryDate
            },
            
            // Real-time tracking from Shiprocket
            realTimeTracking: shiprocketTracking ? {
                currentStatus: shiprocketTracking.track_data?.status || 'Unknown',
                trackingHistory: shiprocketTracking.track_data?.shipment_track || [],
                lastUpdate: shiprocketTracking.track_data?.shipment_track_activities?.[0] || null
            } : null,
            
            // Order items
            items: order.items.map(item => ({
                productId: item.product._id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.offerPrice,
                image: item.product.image
            }))
        };

        return Response.json({
            success: true,
            message: 'Order tracking information retrieved successfully',
            data: trackingData
        });
        
    } catch (error) {
        console.error('Error tracking order:', error);
        
        return Response.json({
            success: false,
            message: `Failed to track order: ${error.message}`,
            error: error.message
        }, { status: 500 });
    }
}
