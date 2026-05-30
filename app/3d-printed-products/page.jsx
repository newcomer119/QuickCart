'use client'
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";

const ThreeDPrintedProducts = () => {
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

    // Filter products to show only 3D printed products (Accessories)
    const threeDPrintedProducts = products.filter(product => 
        product.category === "Accessories"
    );

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                <div className="flex flex-col items-end pt-12">
                    <h1 className="text-2xl font-medium">3D Printed Products</h1>
                    <div className="ml-auto h-0.5 w-full rounded-full bg-orange-600"></div>
                </div>
                <p className="mt-6 max-w-xl text-sm text-justify leading-relaxed">
                    Filament Freaks provides custom 3D printing services across India 
                    including personalized gifts, decorative products, word art, prototypes, 
                    desk accessories, and creative custom-made designs.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
                    {threeDPrintedProducts.map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
                {threeDPrintedProducts.length === 0 && (
                    <div className="w-full text-center py-8">
                        <p className="text-gray-500">No 3D printed products found.</p>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default ThreeDPrintedProducts;
