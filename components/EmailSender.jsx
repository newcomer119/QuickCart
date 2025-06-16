'use client';
import { useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { useUser } from "@clerk/nextjs";

const EmailSender = ({ orderDetails }) => {
    const { user } = useUser();

    useEffect(() => {
        const sendEmail = async () => {
            try {
                console.log('Starting email send process...');
                console.log('Full order details:', JSON.stringify(orderDetails, null, 2));
                console.log('User email:', user?.primaryEmailAddress?.emailAddress);

                if (!orderDetails || !user?.primaryEmailAddress?.emailAddress) {
                    console.error('No order details or user email found');
                    return;
                }

                // Format the items list
                const formattedItems = orderDetails.items.map(item => 
                    `${item.name} - Quantity: ${item.quantity} - Price: ₹${item.price}`
                ).join('\n');

                const templateParams = {
                    email: user.primaryEmailAddress.emailAddress,
                    reply_to: 'mitarthpandey@gmail.com',
                    order_number: orderDetails.orderNumber,
                    total_amount: `₹${orderDetails.totalAmount}`,
                    items: formattedItems,
                    shipping_address: orderDetails.shippingAddress,
                    payment_method: orderDetails.paymentMethod
                };

                console.log('Sending email with template params:', JSON.stringify(templateParams, null, 2));
                console.log('Template variables:', Object.keys(templateParams));
                console.log('Recipient email:', templateParams.email);

                const response = await emailjs.send(
                    'service_ve6jerb',
                    'template_n8fp1wm',
                    templateParams,
                    'H3OV5XwOyzlLlqydo'
                );

                console.log('Email sent successfully:', response);
                console.log('Response status:', response.status);
                console.log('Response text:', response.text);
            } catch (error) {
                console.error('Error sending email:', error);
                console.error('Error details:', {
                    message: error.message,
                    text: error.text,
                    stack: error.stack
                });
            }
        };

        if (orderDetails && user) {
            sendEmail();
        } else {
            console.log('Waiting for order details and user data...');
        }
    }, [orderDetails, user]);

    return null; // This component doesn't render anything
};

export default EmailSender; 