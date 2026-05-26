"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "918533801868";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi Filament Freaks! I have a question about your products."
)}`;

const WhatsAppButton = () => {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#20bd5a] hover:shadow-xl md:bottom-6 md:right-6 md:h-16 md:w-16"
    >
      <FaWhatsapp className="h-7 w-7 md:h-8 md:w-8" />
    </a>
  );
};

export default WhatsAppButton;
