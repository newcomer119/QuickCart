"use client";
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Policies = () => {
  const [activeSection, setActiveSection] = useState("our-policies");

  const sections = [
    { id: "our-policies", title: "Our Policies" },
    { id: "terms", title: "Terms and Conditions" },
    { id: "cancellation", title: "Cancellation & Refund" },
    { id: "shipping", title: "Shipping & Delivery" },
    { id: "privacy", title: "Privacy Policies" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Policies</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 flex-shrink-0">
              <nav className="space-y-1 bg-white rounded-lg shadow-sm p-4">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
              {activeSection === "our-policies" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Policies</h2>
                  <div className="prose max-w-none">
                    {/* Content will be added here */}
                    <p>Our policies content will be added here.</p>
                  </div>
                </div>
              )}

              {activeSection === "terms" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms and Conditions</h2>
                  <div className="prose max-w-none space-y-4">
                    <p className="text-gray-600">
                      For the purpose of these Terms and Conditions, the terms "we," "us," or "our" shall refer to FILAMENT FREAKS, 
                      whose registered/operational office is located at 532 SECTOR 19, CHOPASNI HOUSING BOARD, JODHPUR, RAJASTHAN 342008. 
                      The terms "you," "your," "user," or "visitor" shall refer to any natural or legal person accessing our website 
                      and/or purchasing products or services from us.
                    </p>

                    <p className="text-gray-600">
                      Your use of this website and/or your purchases from us are governed by the following Terms and Conditions:
                    </p>

                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li>The content published on this website is subject to change at any time without prior notice.</li>
                      <li>Neither FILAMENT FREAKS nor any third-party entities provide warranties or guarantees regarding the accuracy, timeliness, performance, completeness, or suitability of the content, information, or materials provided on this website for any particular purpose.</li>
                      <li>Users acknowledge that such content may contain inaccuracies or errors, and FILAMENT FREAKS expressly excludes liability for any such inaccuracies to the fullest extent permitted by law.</li>
                      <li>Any use of information, materials, or services from this website or related products is entirely at the user's own risk. FILAMENT FREAKS shall not be held liable, and it is the user's responsibility to ensure that any products, services, or information obtained through this website meet their specific requirements.</li>
                      <li>All content available on this website—including but not limited to design, layout, appearance, graphics, and written content—is either owned by or licensed to FILAMENT FREAKS.</li>
                      <li>Reproduction of any website material is strictly prohibited, except in accordance with the copyright notice that forms part of these Terms and Conditions.</li>
                      <li>All trademarks displayed on this website, which are not owned by or licensed to FILAMENT FREAKS, are acknowledged appropriately.</li>
                      <li>Unauthorized use of this website or its contents may give rise to a claim for damages and/or constitute a criminal offense.</li>
                      <li>This website may include links to external websites for informational purposes and user convenience. These links do not signify any endorsement by FILAMENT FREAKS, and we bear no responsibility for the content of the linked websites.</li>
                      <li>Users may not create a hyperlink to this website from another website or document without obtaining prior written permission from FILAMENT FREAKS.</li>
                      <li>Any disputes arising out of or in connection with the use of this website or any purchases made through it shall be governed by the laws of India.</li>
                      <li>FILAMENT FREAKS shall not be responsible for any loss or damage incurred—directly or indirectly—due to declined authorization for any transaction by your card issuer or acquiring bank.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeSection === "cancellation" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancellation & Refund</h2>
                  <div className="prose max-w-none space-y-4">
                    <p className="text-gray-600">
                      FILAMENT FREAKS is committed to providing its customers with a fair and accommodating cancellation and refund policy. 
                      The terms of this policy are as follows:
                    </p>

                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
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
                  </div>
                </div>
              )}

              {activeSection === "shipping" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping & Delivery</h2>
                  <div className="prose max-w-none space-y-4">
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li>For international orders, shipments are dispatched and delivered via authorized international courier services and/or international speed post services only.</li>
                      <li>For domestic orders, shipments are dispatched using registered domestic courier partners and/or speed post services exclusively.</li>
                      <li>Delivery is expected within 0 to 7 days, or as per the delivery date agreed upon during order confirmation.</li>
                      <li>Delivery timelines are subject to the operational norms of the designated courier or postal service provider.</li>
                      <li>FILAMENT FREAKS shall not be held liable for any delays in delivery caused by courier agencies or postal authorities.</li>
                      <li>Our responsibility is limited to ensuring the consignment is handed over to the courier or postal service within 0 to 7 days of order and payment, or as per the mutually agreed schedule at the time of order placement.</li>
                      <li>All orders will be delivered to the shipping address provided by the buyer at the time of registration.</li>
                      <li>Order and delivery confirmations will be sent to the buyer via the email address submitted during registration.</li>
                      <li>For any issues or support regarding our services, customers can contact us at 8005833266 or email freaksfilament@gmail.com.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeSection === "privacy" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policies</h2>
                  <div className="prose max-w-none space-y-4">
                    <p className="text-gray-600">
                      FILAMENT FREAKS is committed to safeguarding the privacy of all users interacting with our website and purchasing our 3D printed household appliances. 
                      The following policy outlines how we collect, use, share, and protect personal information:
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Information Collection and Use</h3>
                        <p className="text-gray-600">
                          Personal information is collected solely for the purpose of order fulfillment, service communication, customer support, and business-related improvements. 
                          This may include name, email address, contact number, billing and shipping addresses, and payment-related details (processed securely via trusted payment gateways).
                        </p>
                        <p className="text-gray-600 mt-2">
                          We do not collect or store any sensitive financial details such as CVV numbers or bank credentials. 
                          All online transactions are handled via secure, PCI-DSS-compliant payment partners.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Use of Information</h3>
                        <p className="text-gray-600">The information collected is used to:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                          <li>Process and deliver your order.</li>
                          <li>Notify you of order status and shipment tracking.</li>
                          <li>Manage refunds, cancellations, and replacement requests as per our policies.</li>
                          <li>Provide customer support and service-related communications.</li>
                          <li>Send promotional updates only if explicitly permitted by the customer.</li>
                          <li>Maintain internal business records and comply with applicable laws.</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Information Sharing</h3>
                        <p className="text-gray-600">Your personal information may be shared with:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                          <li>Reputed courier/logistics partners for timely order delivery.</li>
                          <li>Payment service providers to process online payments.</li>
                          <li>Legal or regulatory authorities if required by law.</li>
                          <li>Internal teams responsible for customer support and service fulfillment.</li>
                        </ul>
                        <p className="text-gray-600 mt-2">
                          We do not sell, rent, or disclose your personal data to third parties for marketing or commercial purposes.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Security Measures</h3>
                        <p className="text-gray-600">
                          We implement standard industry security protocols to protect user data. These include encrypted connections, 
                          restricted access to data, and periodic security assessments.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Cookies and Tracking</h3>
                        <p className="text-gray-600">
                          Our website may use cookies to enhance functionality and analyze web traffic. These cookies do not collect 
                          personally identifiable information unless voluntarily provided by the user.
                        </p>
                        <p className="text-gray-600 mt-2">
                          You may choose to disable cookies through your browser settings, though certain features of the website may 
                          become limited as a result.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">User Rights</h3>
                        <p className="text-gray-600">Users have the right to:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                          <li>Access or correct the information shared with us.</li>
                          <li>Opt out of promotional communications at any time.</li>
                          <li>Request the deletion of their personal data, subject to compliance and record-keeping requirements.</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Data Retention</h3>
                        <p className="text-gray-600">
                          Personal data is retained only as long as necessary for fulfilling the purpose for which it was collected, 
                          or as required under legal obligations.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Third-Party Links</h3>
                        <p className="text-gray-600">
                          Our website may include links to third-party websites. We are not responsible for the privacy practices or 
                          content on those platforms. Users are advised to review those sites' privacy policies independently.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                        <p className="text-gray-600">For any privacy-related concerns, complaints, or requests, customers may contact our support team at:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                          <li>📧 Email: freaksfilament@gmail.com</li>
                          <li>📞 Phone: +91-8005833266</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Policies; 