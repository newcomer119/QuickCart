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
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
            templateParams
        );

        return { success: true, data: response };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
}; 