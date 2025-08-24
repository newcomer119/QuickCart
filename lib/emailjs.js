import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
emailjs.init('RU2yjSOjiC4ti0O1r');

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

        const response = await emailjs.send(
            'service_742978e',
            'template_fqx393s',
            templateParams
        );

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