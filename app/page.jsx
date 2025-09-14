'use client'
import React from "react";
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
import TrackingWidget from "@/components/TrackingWidget";

const Home = () => {

  return (
    <>
      <div className="flex items-center justify-between py-3 px-6 md:px-16 lg:px-32">
        <Image
          className="w-60 md:w-48"
          src={assets.logo}
          alt="logo"
        />
        <div className="flex-grow flex justify-center mx-4 max-w-xl">
          <SearchModal />
        </div>
        <div className="hidden lg:block">
          <TrackingWidget className="max-w-xs" />
        </div>
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
    </>
  );
};

export default Home;
