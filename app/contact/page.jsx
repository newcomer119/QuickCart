"use client";
import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <div className="flex flex-col md:flex-row w-full px-4 md:px-16 lg:px-32 pt-12 gap-8 flex-1">
        {/* Contact Form */}
        <div className="flex-1 max-w-xl">
          <h2 className="text-3xl font-semibold mb-2">Contact Us</h2>
          <div className="h-1 w-20 bg-pink-600 mb-8" />
          <form className="flex flex-col gap-6">
            <input type="text" placeholder="Name" className="p-4 rounded-md border border-gray-200 bg-gray-50 text-lg focus:outline-pink-600" />
            <input type="email" placeholder="Email" className="p-4 rounded-md border border-gray-200 bg-gray-50 text-lg focus:outline-pink-600" />
            <input type="tel" placeholder="Phone No." className="p-4 rounded-md border border-gray-200 bg-gray-50 text-lg focus:outline-pink-600" />
            <textarea placeholder="Your Message..." rows={5} className="p-4 rounded-md border border-gray-200 bg-gray-50 text-lg focus:outline-pink-600 resize-none" />
            <button type="submit" className="bg-pink-600 text-white text-xl font-medium py-4 rounded-lg mt-2 hover:bg-pink-700 transition">Send Message</button>
          </form>
        </div>
        {/* Contact Info */}
        <div className="flex-1 max-w-xl">
          <h2 className="text-3xl font-semibold mb-2">Contact Information</h2>
          <div className="h-1 w-20 bg-pink-600 mb-8" />
          <div className="flex flex-col gap-6 text-lg">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-pink-600 text-2xl mt-1" />
              <div>
                <span className="font-bold">Address</span>
                <div>532, Sector 19,<br />Chopasni Housing Board, Jodhpur, Rajasthan - 324008, INDIA</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-pink-600 text-2xl" />
              <div>
                <span className="font-bold">Customer Support</span><br />
                +91-89698119911
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-pink-600 text-2xl" />
              <div>
                <span className="font-bold">Email</span><br />
                freaksfilament@gmail.com
              </div>
            </div>
          </div>
          <div className="mt-10">
            <span className="font-bold text-xl">FOLLOW US</span>
            <div className="flex gap-5 mt-4 text-2xl">
              <a href="https://www.facebook.com/share/19QKk73BaA/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-pink-600"><FaFacebook /></a>
              <a href="https://x.com/filament_freaks?s=21" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-pink-600"><FaTwitter /></a>
              <a href="https://www.instagram.com/freaksfilament?igsh=MTBzb3FtNm5paGd2Ng%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-600"><FaInstagram /></a>
              <a href="https://www.youtube.com/@filament_freaks" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-pink-600"><FaYoutube /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-pink-600"><FaLinkedin /></a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 