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
            to_email: email,
            order_number: orderNumber,
            total_amount: totalAmount,
            items: items,
            shipping_address: shippingAddress,
            payment_method: paymentMethod
        });

        const templateParams = {
            to_email: email,
            order_number: orderNumber,
            total_amount: totalAmount,
            items: items.map(item => `${item.name} - Quantity: ${item.quantity} - Price: ₹${item.price}`).join('\n'),
            shipping_address: shippingAddress,
            payment_method: paymentMethod
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