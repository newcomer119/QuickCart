import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <Image className="w-28 md:w-32" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm">
            Your premier destination for all things 3D printing. We specialize in high-quality filaments, 
            professional-grade 3D printers, and custom designs. Whether you're a hobbyist or a professional, 
            we provide everything you need to bring your 3D printing projects to life. From PLA to PETG, 
            from entry-level to industrial printers, we've got you covered with the best products and expert support.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/" className="hover:underline transition">Home</Link>
              </li>
              <li>
                <Link href="/all-products" className="hover:underline transition">Shop</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline transition">Contact us</Link>
              </li>
              <li>
                <Link href="/policies" className="hover:underline transition">Privacy policy</Link>
              </li>
            </ul>
          </div>
        </div>

      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2025 © 3D Print Store All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;