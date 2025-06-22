'use client'
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CancellationPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Cancellation & Refund</h1>
            <div className="space-y-6 text-gray-700">
              <section>
                <p>FILAMENT FREAKS is committed to providing its customers with a fair and accommodating cancellation and refund policy. The terms of this policy are as follows:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cancellation requests will be considered only if submitted within seven (7) days from the date of placing the order. However, such requests may not be accepted if the order has already been communicated to the vendor/merchant and the shipping process has commenced.</li>
                  <li>In cases where the product is ready for shipment:
                    <ul className="list-disc pl-6 mt-2">
                      <li>For online payments, a security charge shall be deducted from the refund amount.</li>
                      <li>For Cash on Delivery (COD) orders, the cancellation request will be declined.</li>
                    </ul>
                  </li>
                  <li>For items that are damaged or defective upon delivery, the issue must be reported to our Customer Service team within seven (7) days of receipt. The resolution will be provided only after the merchant has reviewed and confirmed the nature of the defect.</li>
                  <li>If the product received does not match its description or does not meet the customer's expectations, the customer must notify our Customer Service team within seven (7) days of delivery. After reviewing the complaint, an appropriate course of action will be taken by the team.</li>
                  <li>For products covered under a manufacturer's warranty, any complaints should be directed to the respective manufacturer as per their warranty policy.</li>
                  <li>In cases where refunds are approved by FILAMENT FREAKS, the amount will be processed within three (3) to five (5) business days from the date of approval.</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CancellationPolicy; 