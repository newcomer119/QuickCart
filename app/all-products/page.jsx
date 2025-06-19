'use client'
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";

const AllProducts = () => {
    const { products, setIsLoading } = useAppContext();

    useEffect(() => {
        // Stop loading immediately when page loads
        setIsLoading(false);
        // Fallback: stop loading after 2 seconds to prevent infinite loading
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, [setIsLoading]);

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                <div className="flex flex-col items-end pt-12">
                    <p className="text-2xl font-medium">All products</p>
                    <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                </div>
                {/* Removed Color Filter UI */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
                    {products.map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
                {products.length === 0 && (
                    <div className="w-full text-center py-8">
                        <p className="text-gray-500">No products found.</p>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;
