'use client';
import { useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { useUser } from "@clerk/nextjs";

const EmailSender = ({ orderDetails }) => {
    const { user } = useUser();

    useEffect(() => {
        const sendEmail = async () => {
            try {
                if (!orderDetails || !user?.primaryEmailAddress?.emailAddress) {
                    return;
                }

                // Initialize EmailJS
                emailjs.init('RU2yjSOjiC4ti0O1r');

                // Format the items for the template
                const orders = orderDetails.items.map(item => ({
                    name: item.name,
                    units: item.quantity,
                    price: item.price,
                    image_url: item.image || 'https://via.placeholder.com/64x64?text=Product' // fallback image
                }));

                // Calculate shipping and tax (you can adjust these values)
                const shipping = 50; // Default shipping cost
                const gst = Math.round(orderDetails.totalAmount * 0.18); // 18% GST
                const subtotal = orderDetails.totalAmount - shipping - gst;

                const templateParams = {
                    email: user.primaryEmailAddress.emailAddress,
                    to_name: user?.fullName || user?.firstName || 'Customer',
                    from_name: 'FilamentFreaks',
                    reply_to: 'freaksfilament@gmail.com',
                    order_id: orderDetails.orderNumber,
                    orders: orders,
                    cost: {
                        shipping: shipping,
                        gst: gst,
                        total: orderDetails.totalAmount
                    },
                    shipping_address: orderDetails.shippingAddress,
                    payment_method: orderDetails.paymentMethod
                };

                // Try the send method first
                try {
                    await emailjs.send(
                        'service_ktyfsb8',
                        'template_9dd766b',
                        templateParams
                    );
                } catch (sendError) {
                    // Create a temporary form element
                    const form = document.createElement('form');
                    form.style.display = 'none';
                    
                    // Add all template parameters as hidden inputs
                    Object.keys(templateParams).forEach(key => {
                        const input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = key;
                        input.value = typeof templateParams[key] === 'object' 
                            ? JSON.stringify(templateParams[key]) 
                            : templateParams[key];
                        form.appendChild(input);
                    });
                    
                    document.body.appendChild(form);
                    
                    await emailjs.sendForm(
                        'service_ktyfsb8',
                        'template_9dd766b',
                        form
                    );
                    
                    document.body.removeChild(form);
                }
            } catch (error) {
                // Silent fail - don't show errors to user
            }
        };

        if (orderDetails && user) {
            sendEmail();
        }
    }, [orderDetails, user]);

    return null; // This component doesn't render anything
};

export default EmailSender;