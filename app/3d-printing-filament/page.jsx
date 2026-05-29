'use client'

import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";
import { isFilamentCategory } from "@/lib/productCategories";

const FilamentProducts = () => {
    const { products, setIsLoading } = useAppContext();

    useEffect(() => {
        setIsLoading(false);
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, [setIsLoading]);

    const filamentProducts = products.filter(product =>
        isFilamentCategory(product.category)
    );

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                <div className="flex flex-col items-end pt-12">
                    <p className="text-2xl font-medium">3D Printing Filament</p>
                    <p>PLA+ Filaments
                       Our PLA+ filaments are designed for smooth printing, strong 
                       layer adhesion, durability, and high-quality 3D printing results 
                       for creators and professionals.
                    </p>
                    <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
                    {filamentProducts.map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
                {filamentProducts.length === 0 && (
                    <div className="w-full text-center py-8">
                        <p className="text-gray-500">No filament products found.</p>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default FilamentProducts;
