'use client'
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsAndConditions = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
            <div className="space-y-6 text-gray-700">
              <section>
                <p>For the purpose of these Terms and Conditions, the terms "we," "us," or "our" shall refer to FILAMENT FREAKS, whose registered/operational office is located at 532 SECTOR 19, CHOPASNI HOUSING BOARD, JODHPUR, RAJASTHAN 342008. The terms "you," "your," "user," or "visitor" shall refer to any natural or legal person accessing our website and/or purchasing products or services from us.</p>
                <p>Your use of this website and/or your purchases from us are governed by the following Terms and Conditions:</p>
                <ul className="list-disc pl-6 space-y-2">
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
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsAndConditions; 