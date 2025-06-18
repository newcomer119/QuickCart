'use client'
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";

const AllProducts = () => {

    const { products, setIsLoading } = useAppContext();
    const [selectedColor, setSelectedColor] = useState('All');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        // Stop loading immediately when page loads
        setIsLoading(false);
        
        // Fallback: stop loading after 2 seconds to prevent infinite loading
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timeout);
    }, [setIsLoading]);

    useEffect(() => {
        if (selectedColor === 'All') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(product => 
                product.colors && product.colors.includes(selectedColor)
            ));
        }
    }, [products, selectedColor]);

    const colors = ['All', 'Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Purple', 'Pink', 'Orange', 'Gray', 'Silver', 'Gold', 'Brown', 'Multi'];

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                <div className="flex flex-col items-end pt-12">
                    <p className="text-2xl font-medium">All products</p>
                    <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                </div>
                
                {/* Color Filter */}
                <div className="w-full mt-6 mb-4">
                    <p className="text-base font-medium mb-3">Filter by Color:</p>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color) => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                    selectedColor === color
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
                    {filteredProducts.map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
                
                {filteredProducts.length === 0 && (
                    <div className="w-full text-center py-8">
                        <p className="text-gray-500">No products found for the selected color.</p>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;
