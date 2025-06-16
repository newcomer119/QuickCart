'use client'
import React, { useState } from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { assets } from "@/assets/assets";
import SearchModal from "@/components/SearchModal";

const Home = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between py-3 px-6 md:px-16 lg:px-32">
        <Image
          className="w-60 md:w-48"
          src={assets.logo}
          alt="logo"
        />
        <button
          onClick={() => setIsSearchOpen(true)}
          className="hover:text-gray-900 transition"
        >
          <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        </button>
      </div>
      <Navbar/>
      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        <HomeProducts />
        <FeaturedProduct />
        <Banner />
        <NewsLetter />
      </div>
      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Home;
