/**
 * Create Shiprocket Shipment
 * This route creates a shipment in Shiprocket after order placement
 */

import { createShipment, getShippingRates } from '@/lib/shiprocket';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Address from '@/models/Address';
import User from '@/models/Users';
import connectDb from '@/config/db';

export async function POST(request) {
    try {
        await connectDb();
        
        const { orderId, courierId } = await request.json();
        
        if (!orderId) {
            return Response.json({
                success: false,
                message: 'Order ID is required'
            }, { status: 400 });
        }

        // Find the order with populated data
        const order = await Order.findById(orderId)
            .populate('address')
            .populate('items.product');

        if (!order) {
            return Response.json({
                success: false,
                message: 'Order not found'
            }, { status: 404 });
        }

        // Get user details
        const user = await User.findById(order.userId);
        if (!user) {
            return Response.json({
                success: false,
                message: 'User not found'
            }, { status: 404 });
        }

        // Get address details
        const address = await Address.findById(order.address);
        if (!address) {
            return Response.json({
                success: false,
                message: 'Address not found'
            }, { status: 404 });
        }

        // Prepare shipment data for Shiprocket
        const shipmentData = {
            order_id: order.customOrderId || orderId,
            order_date: new Date(order.date).toISOString().split('T')[0],
            pickup_location: "warehouse", // Your actual pickup location identifier from Shiprocket
            billing_customer_name: address.fullName || user.name || "Customer",
            billing_last_name: "",
            billing_address: `${address.area}, ${address.city}, ${address.state} ${address.pincode}, India`,
            billing_address_2: "",
            billing_city: address.city,
            billing_pincode: address.pincode,
            billing_state: address.state,
            billing_country: "India",
            billing_email: user.email,
            billing_phone: address.phoneNumber || user.phone || "8750461279",  
            shipping_is_billing: true,
            order_items: order.items.map(item => ({
                name: item.product.name,
                sku: item.product._id.toString(),
                units: item.quantity,
                selling_price: item.product.offerPrice,
                discount: item.product.price - item.product.offerPrice,
                tax: Math.floor(item.product.offerPrice * 0.18),
                hsn: "8518", // Default HSN for electronics
                product_type: "standard"
            })),
            payment_method: order.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
            sub_total: order.subtotal,
            length: 10,
            breadth: 10,
            height: 5,
            weight: 0.5,
            shipping_charges: order.deliveryCharges,
            total_discount: order.discount,
            cod_amount: order.paymentMethod === 'COD' ? order.amount : 0
        };

        console.log('Creating Shiprocket shipment for order:', orderId);
        console.log('Shipment data:', JSON.stringify(shipmentData, null, 2));

        // Validate required fields
        const requiredFields = ['order_id', 'pickup_location', 'billing_customer_name', 'billing_address', 'billing_city', 'billing_pincode', 'billing_state', 'billing_country', 'billing_email', 'billing_phone'];
        const missingFields = requiredFields.filter(field => !shipmentData[field]);
        
        if (missingFields.length > 0) {
            console.error('Missing required fields:', missingFields);
            return Response.json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            }, { status: 400 });
        }

        // Create shipment in Shiprocket
        const shipmentResponse = await createShipment(shipmentData);

        console.log('Full Shiprocket response:', JSON.stringify(shipmentResponse, null, 2));

        // Handle different response structures from Shiprocket
        // Check if response has shipment_id (successful creation) or if it's wrapped in status/data
        let shipment;
        if (shipmentResponse.shipment_id) {
            // Direct response format (what we're getting)
            shipment = shipmentResponse;
        } else if (shipmentResponse.status === 201 && shipmentResponse.data) {
            // Wrapped response format
            shipment = shipmentResponse.data;
        } else {
            console.error('Shiprocket API returned unexpected response:', shipmentResponse);
            throw new Error(`Shiprocket API error: ${shipmentResponse.message || shipmentResponse.error || JSON.stringify(shipmentResponse)}`);
        }

        // Update order with Shiprocket details
        await Order.findByIdAndUpdate(orderId, {
            shiprocketAWB: shipment.awb_code || '',
            shipmentId: shipment.shipment_id ? shipment.shipment_id.toString() : '',
            courierName: shipment.courier_name || '',
            trackingUrl: shipment.awb_code ? `https://www.shiprocket.in/tracking/${shipment.awb_code}` : '',
            shipmentStatus: shipment.status || 'NEW',
            pickupScheduledDate: shipment.pickup_scheduled_date ? new Date(shipment.pickup_scheduled_date) : null,
            expectedDeliveryDate: shipment.expected_delivery_date ? new Date(shipment.expected_delivery_date) : null
        });

        console.log('Shipment created successfully:', {
            orderId,
            shiprocketOrderId: shipment.order_id,
            shipmentId: shipment.shipment_id,
            channelOrderId: shipment.channel_order_id,
            status: shipment.status,
            awb: shipment.awb_code
        });

        return Response.json({
            success: true,
            message: 'Shipment created successfully',
            data: {
                shiprocketOrderId: shipment.order_id,
                shipmentId: shipment.shipment_id,
                channelOrderId: shipment.channel_order_id,
                status: shipment.status,
                awb: shipment.awb_code || '',
                courier: shipment.courier_name || '',
                trackingUrl: shipment.awb_code ? `https://www.shiprocket.in/tracking/${shipment.awb_code}` : '',
                pickupDate: shipment.pickup_scheduled_date,
                expectedDelivery: shipment.expected_delivery_date
            }
        });

    } catch (error) {
        console.error('Error creating shipment:', error);
        return Response.json({
            success: false,
            message: `Failed to create shipment: ${error.message}`,
            error: error.message
        }, { status: 500 });
    }
}
