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
            pickup_location: "Primary", // Shiprocket expects pickup location name/ID as string
            billing_customer_name: user.name || "Customer",
            billing_last_name: "",
            billing_address: `${address.address}, ${address.city}, ${address.state} ${address.pincode}, India`,
            billing_address_2: "",
            billing_city: address.city,
            billing_pincode: address.pincode,
            billing_state: address.state,
            billing_country: "India",
            billing_email: user.email,
            billing_phone: user.phone || "8750461279",
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

        // Create shipment in Shiprocket
        const shipmentResponse = await createShipment(shipmentData);

        if (shipmentResponse.status === 201 && shipmentResponse.data) {
            const shipment = shipmentResponse.data;

            // Update order with Shiprocket details
            await Order.findByIdAndUpdate(orderId, {
                shiprocketAWB: shipment.awb_code,
                shipmentId: shipment.id.toString(),
                courierName: shipment.courier_name,
                trackingUrl: `https://www.shiprocket.in/tracking/${shipment.awb_code}`,
                shipmentStatus: 'PENDING',
                pickupScheduledDate: shipment.pickup_scheduled_date ? new Date(shipment.pickup_scheduled_date) : null,
                expectedDeliveryDate: shipment.expected_delivery_date ? new Date(shipment.expected_delivery_date) : null
            });

            console.log('Shipment created successfully:', {
                orderId,
                awb: shipment.awb_code,
                courier: shipment.courier_name,
                trackingUrl: `https://www.shiprocket.in/tracking/${shipment.awb_code}`
            });

            return Response.json({
                success: true,
                message: 'Shipment created successfully',
                data: {
                    awb: shipment.awb_code,
                    courier: shipment.courier_name,
                    trackingUrl: `https://www.shiprocket.in/tracking/${shipment.awb_code}`,
                    status: shipment.status,
                    pickupDate: shipment.pickup_scheduled_date,
                    expectedDelivery: shipment.expected_delivery_date
                }
            });
        } else {
            throw new Error(`Shiprocket API error: ${shipmentResponse.message || 'Unknown error'}`);
        }

    } catch (error) {
        console.error('Error creating shipment:', error);
        return Response.json({
            success: false,
            message: `Failed to create shipment: ${error.message}`,
            error: error.message
        }, { status: 500 });
    }
}
