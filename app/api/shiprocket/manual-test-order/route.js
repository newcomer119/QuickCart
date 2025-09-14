/**
 * Manual Test Order Creation in Shiprocket
 * Uses exact data from your real order
 */

import { createShipment } from '@/lib/shiprocket';

export async function POST() {
    try {
        console.log('Creating manual test order in Shiprocket with real order data...');
        
        // Use the exact data from your order
        const manualOrderData = {
            order_id: "MANUAL-TEST-25-26/W/0263",
            order_date: new Date().toISOString().split('T')[0],
            pickup_location: "warehouse",
            billing_customer_name: "King Kong",
            billing_last_name: "",
            billing_address: "Bidholi Uk D, dehradoon, Uttarakhand 248007, India",
            billing_address_2: "",
            billing_city: "dehradoon",
            billing_pincode: "248007",
            billing_state: "Uttarakhand",
            billing_country: "India",
            billing_email: "8750461279a@gmail.com",
            billing_phone: "09104411978",
            shipping_is_billing: true,
            order_items: [
                {
                    name: "Adjustable 3D Printed Phone Stand – Ergonomic and Foldable Mobile Holder with Gears – Stylish Geometric Design – Compatible with All Smartphones (Magenta and White",
                    sku: "686e137f55572d5e2c73ae73",
                    units: 1,
                    selling_price: 999,
                    discount: 0,
                    tax: 180,
                    hsn: "8518",
                    product_type: "standard"
                }
            ],
            payment_method: "COD",
            sub_total: 999,
            length: 10,
            breadth: 10,
            height: 5,
            weight: 0.5,
            shipping_charges: 179,
            total_discount: 0,
            cod_amount: 1178
        };

        console.log('Manual order data:', JSON.stringify(manualOrderData, null, 2));

        // Create order in Shiprocket
        const response = await createShipment(manualOrderData);
        
        console.log('Manual Shiprocket response:', JSON.stringify(response, null, 2));

        return Response.json({
            success: true,
            message: 'Manual test order created successfully',
            data: {
                manualOrderId: manualOrderData.order_id,
                shiprocketResponse: response
            }
        });

    } catch (error) {
        console.error('Error creating manual test order:', error);
        
        return Response.json({
            success: false,
            message: `Failed to create manual test order: ${error.message}`,
            error: error.message
        }, { status: 500 });
    }
}
