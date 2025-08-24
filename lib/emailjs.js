import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
emailjs.init('RU2yjSOjiC4ti0O1r');

// Verify initialization
console.log('EmailJS initialized with public key:', 'RU2yjSOjiC4ti0O1r');
console.log('EmailJS service ID:', 'service_742978e');
console.log('EmailJS template ID:', 'template_fqx393s');

export const sendOrderConfirmationEmail = async ({
    email,
    orderNumber,
    totalAmount,
    items,
    shippingAddress,
    paymentMethod
}) => {
    try {
        const templateParams = {
            email: email,
            order_id: orderNumber,
            orders: items.map(item => ({
                name: item.name,
                units: item.quantity,
                price: item.price
            })),
            cost: {
                shipping: 0, // You can calculate this based on your logic
                gst: Math.floor(totalAmount * 0.18), // 18% GST
                total: totalAmount
            }
        };

        const response = await emailjs.send(
            'service_742978e',
            'template_fqx393s',
            templateParams
        );

        return { success: true, data: response };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};

export const sendGSTInvoiceEmail = async ({
    email,
    orderNumber,
    customerName,
    totalAmount,
    items,
    address,
    pdfFile
}) => {
    try {
        // Check file size first
        if (pdfFile.size > 1 * 1024 * 1024) {
            // File too large, send email without attachment
            const templateParams = {
                to_email: email,
                customer_name: customerName,
                order_id: orderNumber,
                order_date: new Date().toLocaleDateString(),
                total_amount: totalAmount,
                shipping_address: `${address?.area || ''}, ${address?.city || ''}, ${address?.state || ''} - ${address?.pincode || ''}`,
                items_list: items.map(item => `${item.product?.name || 'Product'} x${item.quantity}`).join(', '),
                pdf_filename: pdfFile.name,
                note: 'Note: PDF file was too large to attach. Please contact support for the invoice.'
            };

            console.log('Sending GST invoice email WITHOUT attachment (file too large):', {
                email,
                customerName,
                orderNumber,
                totalAmount,
                pdfFileSize: pdfFile.size
            });

            const response = await emailjs.send(
                'service_742978e',
                'template_fqx393s',
                templateParams,
                'RU2yjSOjiC4ti0O1r'
            );

            console.log('EmailJS response (no attachment):', response);
            return { success: true, data: response, note: 'Email sent without PDF attachment due to file size' };
        }

        // Convert PDF file to base64 for EmailJS attachment
        const base64File = await convertFileToBase64(pdfFile);
        
        const templateParams = {
            to_email: email,
            customer_name: customerName,
            order_id: orderNumber,
            order_date: new Date().toLocaleDateString(),
            total_amount: totalAmount,
            shipping_address: `${address?.area || ''}, ${address?.city || ''}, ${address?.state || ''} - ${address?.pincode || ''}`,
            items_list: items.map(item => `${item.product?.name || 'Product'} x${item.quantity}`).join(', '),
            pdf_attachment: base64File,
            pdf_filename: pdfFile.name
        };

        console.log('Sending GST invoice email WITH attachment:', {
            email,
            customerName,
            orderNumber,
            totalAmount,
            pdfFileSize: pdfFile.size,
            base64Length: base64File.length
        });

        const response = await emailjs.send(
            'service_742978e',
            'template_fqx393s',
            templateParams,
            'RU2yjSOjiC4ti0O1r'
        );

        console.log('EmailJS response (with attachment):', response);
        return { success: true, data: response };
    } catch (error) {
        console.error('Error sending GST invoice email:', error);
        return { success: false, error };
    }
};

// Helper function to convert file to base64
const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Remove the data:application/pdf;base64, prefix
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = (error) => reject(error);
    });
}; 

// Test function to verify EmailJS is working
export const testEmailJS = async () => {
    try {
        const testParams = {
            to_email: 'test@example.com',
            customer_name: 'Test Customer',
            order_id: 'TEST-123',
            order_date: new Date().toLocaleDateString(),
            total_amount: 100,
            shipping_address: 'Test Address',
            items_list: 'Test Product x1'
        };

        console.log('Testing EmailJS with params:', testParams);

        const response = await emailjs.send(
            'service_742978e',
            'template_fqx393s',
            testParams,
            'RU2yjSOjiC4ti0O1r'
        );

        console.log('EmailJS test successful:', response);
        return { success: true, data: response };
    } catch (error) {
        console.error('EmailJS test failed:', error);
        return { success: false, error };
    }
}; 