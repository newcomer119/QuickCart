/**
 * Test Create Order in Shiprocket
 * This route manually creates a test order in Shiprocket dashboard
 */

import { createShipment } from '@/lib/shiprocket';

export async function POST() {
    try {
        console.log('Creating test order in Shiprocket...');
        
        // Test order data
        const testOrderData = {
            order_id: "TEST-" + Date.now(),
            order_date: new Date().toISOString().split('T')[0],
            pickup_location: "warehouse",
            billing_customer_name: "Test Customer",
            billing_last_name: "",
            billing_address: "123 Test Street, Dehradun, Uttarakhand 248007, India",
            billing_address_2: "",
            billing_city: "Dehradun",
            billing_pincode: "248007",
            billing_state: "Uttarakhand",
            billing_country: "India",
            billing_email: "test@example.com",
            billing_phone: "9876543210",
            shipping_is_billing: true,
            order_items: [
                {
                    name: "Test Product",
                    sku: "TEST-SKU-001",
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
            shipping_charges: 50,
            total_discount: 0,
            cod_amount: 1049
        };

        console.log('Test order data:', JSON.stringify(testOrderData, null, 2));

        // Create order in Shiprocket
        const response = await createShipment(testOrderData);
        
        console.log('Shiprocket response:', JSON.stringify(response, null, 2));

        return Response.json({
            success: true,
            message: 'Test order created successfully',
            data: {
                testOrderId: testOrderData.order_id,
                shiprocketResponse: response
            }
        });

    } catch (error) {
        console.error('Error creating test order:', error);
        
        return Response.json({
            success: false,
            message: `Failed to create test order: ${error.message}`,
            error: error.message
        }, { status: 500 });
    }
}
