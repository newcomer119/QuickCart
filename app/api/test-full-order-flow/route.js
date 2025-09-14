/**
 * Test Full Order Flow
 * Creates order in database and then in Shiprocket
 */

import { NextResponse } from "next/server";
import connectDb from "@/config/db";
import Order from "@/models/Order";
import User from "@/models/Users";
import Address from "@/models/Address";
import Product from "@/models/Product";
import { createShipment } from '@/lib/shiprocket';

export async function POST() {
    try {
        await connectDb();
        
        console.log('Testing full order flow...');
        
        // Find or create test user
        let testUser = await User.findOne({ email: 'test@example.com' });
        if (!testUser) {
            testUser = await User.create({
                _id: `test-user-${Date.now()}`,
                name: 'Test Customer',
                email: 'test@example.com',
                imageUrl: 'https://example.com/test-avatar.jpg',
                cartItems: {}
            });
        }
        
        // Find or create test address
        let testAddress = await Address.findOne({ userId: testUser._id.toString() });
        if (!testAddress) {
            testAddress = await Address.create({
                userId: testUser._id.toString(),
                fullName: 'Test Customer',
                phoneNumber: '9876543210',
                pincode: 248007,
                area: 'Test Area',
                city: 'Dehradun',
                state: 'Uttarakhand'
            });
        }
        
        // Find a test product
        const testProduct = await Product.findOne();
        if (!testProduct) {
            return NextResponse.json({
                success: false,
                message: 'No products found in database'
            }, { status: 400 });
        }
        
        // Create test order in database
        const testOrder = await Order.create({
            customOrderId: `TEST-DB-${Date.now()}`,
            userId: testUser._id.toString(),
            address: testAddress._id,
            items: [{
                product: testProduct._id,
                quantity: 1
            }],
            amount: 999,
            subtotal: 999,
            deliveryCharges: 50,
            discount: 0,
            paymentMethod: 'COD',
            paymentStatus: 'PENDING',
            status: 'PENDING'
        });
        
        console.log('Test order created in database:', testOrder);
        
        // Now send to Shiprocket
        const orderWithPopulated = await Order.findById(testOrder._id)
            .populate('address')
            .populate('items.product');
        
        const shipmentData = {
            order_id: orderWithPopulated.customOrderId,
            order_date: new Date(orderWithPopulated.date).toISOString().split('T')[0],
            pickup_location: "warehouse",
            billing_customer_name: orderWithPopulated.address.fullName,
            billing_last_name: "",
            billing_address: `${orderWithPopulated.address.area}, ${orderWithPopulated.address.city}, ${orderWithPopulated.address.state} ${orderWithPopulated.address.pincode}, India`,
            billing_address_2: "",
            billing_city: orderWithPopulated.address.city,
            billing_pincode: orderWithPopulated.address.pincode,
            billing_state: orderWithPopulated.address.state,
            billing_country: "India",
            billing_email: testUser.email,
            billing_phone: orderWithPopulated.address.phoneNumber,
            shipping_is_billing: true,
            order_items: orderWithPopulated.items.map(item => ({
                name: item.product.name,
                sku: item.product._id.toString(),
                units: item.quantity,
                selling_price: item.product.offerPrice,
                discount: item.product.price - item.product.offerPrice,
                tax: Math.floor(item.product.offerPrice * 0.18),
                hsn: "8518",
                product_type: "standard"
            })),
            payment_method: orderWithPopulated.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
            sub_total: orderWithPopulated.subtotal,
            length: 10,
            breadth: 10,
            height: 5,
            weight: 0.5,
            shipping_charges: orderWithPopulated.deliveryCharges,
            total_discount: orderWithPopulated.discount,
            cod_amount: orderWithPopulated.paymentMethod === 'COD' ? orderWithPopulated.amount : 0
        };
        
        console.log('Shipment data:', JSON.stringify(shipmentData, null, 2));
        
        const shiprocketResponse = await createShipment(shipmentData);
        console.log('Shiprocket response:', shiprocketResponse);
        
        // Update order with Shiprocket details
        let shipment;
        if (shiprocketResponse.shipment_id) {
            shipment = shiprocketResponse;
        } else if (shiprocketResponse.status === 201 && shiprocketResponse.data) {
            shipment = shiprocketResponse.data;
        }
        
        if (shipment) {
            await Order.findByIdAndUpdate(testOrder._id, {
                shiprocketAWB: shipment.awb_code || '',
                shipmentId: shipment.shipment_id ? shipment.shipment_id.toString() : '',
                courierName: shipment.courier_name || '',
                trackingUrl: shipment.awb_code ? `https://www.shiprocket.in/tracking/${shipment.awb_code}` : '',
                shipmentStatus: shipment.status || 'NEW'
            });
        }
        
        return NextResponse.json({
            success: true,
            message: 'Full order flow test completed',
            data: {
                orderId: testOrder._id,
                customOrderId: testOrder.customOrderId,
                shiprocketResponse: shiprocketResponse
            }
        });
        
    } catch (error) {
        console.error('Error in full order flow test:', error);
        return NextResponse.json({
            success: false,
            message: `Test failed: ${error.message}`,
            error: error.message
        }, { status: 500 });
    }
}
