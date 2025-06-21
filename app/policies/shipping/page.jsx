'use client'
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ShippingAndDelivery = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping & Delivery</h1>
            <div className="space-y-6 text-gray-700">
              <section>
                <p>For international orders, shipments are dispatched and delivered via authorized international courier services and/or international speed post services only.</p>
                <p>For domestic orders, shipments are dispatched using registered domestic courier partners and/or speed post services exclusively.</p>
                <p>Delivery is expected within 0 to 7 days, or as per the delivery date agreed upon during order confirmation.</p>
                <p>Delivery timelines are subject to the operational norms of the designated courier or postal service provider.</p>
                <p>FILAMENT FREAKS shall not be held liable for any delays in delivery caused by courier agencies or postal authorities.</p>
                <p>Our responsibility is limited to ensuring the consignment is handed over to the courier or postal service within 0 to 7 days of order and payment, or as per the mutually agreed schedule at the time of order placement.</p>
                <p>All orders will be delivered to the shipping address provided by the buyer at the time of registration.</p>
                <p>Order and delivery confirmations will be sent to the buyer via the email address submitted during registration.</p>
                <p>For any issues or support regarding our services, customers can contact us at 8005833266 or email freaksfilament@gmail.com.</p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShippingAndDelivery; 