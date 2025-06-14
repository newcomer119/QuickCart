import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Banner = () => {
  const router = useRouter();

  const handleShopNow = () => {
    router.push('/all-products');
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 bg-[#E6E9F2] my-16 rounded-xl p-12">
      <h2 className="text-3xl md:text-4xl font-semibold max-w-[600px]">
        Transform Your Ideas into 3D Reality
      </h2>
      <p className="max-w-[500px] font-medium text-gray-800/60 text-lg">
        Discover our premium collection of 3D printing filaments, custom designs, and professional-grade equipment
      </p>
      <button 
        onClick={handleShopNow}
        className="group flex items-center justify-center gap-2 px-12 py-3 bg-orange-600 rounded-full text-white hover:bg-orange-700 transition"
      >
        Explore Collection
        <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon_white} alt="arrow_icon_white" />
      </button>
    </div>
  );
};

export default Banner;