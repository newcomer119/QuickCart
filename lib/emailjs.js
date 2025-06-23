import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);

export const sendOrderConfirmationEmail = async ({
    email,
    orderNumber,
    totalAmount,
    items,
    shippingAddress,
    paymentMethod
}) => {
    try {
        console.log('Starting email send process...');
        console.log('Email parameters:', {
            email: email,
            order_id: orderNumber,
            orders: items,
            cost: {
                shipping: 0, // You can calculate this based on your logic
                gst: Math.floor(totalAmount * 0.18), // 18% GST
                total: totalAmount
            }
        });

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

        console.log('Sending email with template params:', templateParams);
        console.log('Using service ID:', process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID);
        console.log('Using template ID:', process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID);

        const response = await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
            templateParams
        );

        console.log('Email sent successfully:', response);
        return { success: true, data: response };
    } catch (error) {
        console.error('Error sending email:', error);
        console.error('Error details:', {
            message: error.message,
            text: error.text,
            stack: error.stack
        });
        return { success: false, error };
    }
}; 