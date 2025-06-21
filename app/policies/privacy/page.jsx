'use client'
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
            <div className="space-y-6 text-gray-700">
              <section>
                <p><strong>FILAMENT FREAKS</strong> is committed to safeguarding the privacy of all users interacting with our website and purchasing our 3D printed household appliances. The following policy outlines how we collect, use, share, and protect personal information:</p>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Information Collection and Use</h2>
                <p>Personal information is collected solely for the purpose of order fulfillment, service communication, customer support, and business-related improvements. This may include name, email address, contact number, billing and shipping addresses, and payment-related details (processed securely via trusted payment gateways).</p>
                <p>We do not collect or store any sensitive financial details such as CVV numbers or bank credentials. All online transactions are handled via secure, PCI-DSS-compliant payment partners.</p>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Use of Information</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process and deliver your order.</li>
                  <li>Notify you of order status and shipment tracking.</li>
                  <li>Manage refunds, cancellations, and replacement requests as per our policies.</li>
                  <li>Provide customer support and service-related communications.</li>
                  <li>Send promotional updates only if explicitly permitted by the customer.</li>
                  <li>Maintain internal business records and comply with applicable laws.</li>
                </ul>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Information Sharing</h2>
                <p>Your personal information may be shared with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Reputed courier/logistics partners for timely order delivery.</li>
                  <li>Payment service providers to process online payments.</li>
                  <li>Legal or regulatory authorities if required by law.</li>
                  <li>Internal teams responsible for customer support and service fulfillment.</li>
                </ul>
                <p>We do not sell, rent, or disclose your personal data to third parties for marketing or commercial purposes.</p>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Security Measures</h2>
                <p>We implement standard industry security protocols to protect user data. These include encrypted connections, restricted access to data, and periodic security assessments.</p>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Cookies and Tracking</h2>
                <p>Our website may use cookies to enhance functionality and analyze web traffic. These cookies do not collect personally identifiable information unless voluntarily provided by the user.</p>
                <p>You may choose to disable cookies through your browser settings, though certain features of the website may become limited as a result.</p>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">User Rights</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access or correct the information shared with us.</li>
                  <li>Opt out of promotional communications at any time.</li>
                  <li>Request the deletion of their personal data, subject to compliance and record-keeping requirements.</li>
                </ul>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Data Retention</h2>
                <p>Personal data is retained only as long as necessary for fulfilling the purpose for which it was collected, or as required under legal obligations.</p>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Third-Party Links</h2>
                <p>Our website may include links to third-party websites. We are not responsible for the privacy practices or content on those platforms. Users are advised to review those sites' privacy policies independently.</p>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Contact Information</h2>
                <p>For any privacy-related concerns, complaints, or requests, customers may contact our support team at:</p>
                <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                  <p>📧 Email: freaksfilament@gmail.com</p>
                  <p>📞 Phone: +91-8005833266</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy; 