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

    // Allowed colors: black, forest green, magenta, lavender
    const allowedColors = ['black', 'forest green', 'magenta', 'lavender'];
    
    // Helper function to normalize color names for matching
    const normalizeColor = (color) => {
        if (!color) return '';
        const normalized = color.toLowerCase().trim();
        // Handle variations
        if (normalized.includes('black')) return 'black';
        if (normalized.includes('forest') && normalized.includes('green')) return 'forest green';
        if (normalized.includes('magenta')) return 'magenta';
        if (normalized.includes('lavender') || normalized.includes('violet')) return 'lavender';
        return normalized;
    };
    
    // Helper function to check if a color is allowed
    const isAllowedColor = (color) => {
        const normalized = normalizeColor(color);
        return allowedColors.includes(normalized);
    };
    
    // Filter and modify products
    const threeDPrintedProducts = products
        .filter(product => {
            // First check if material contains PLA
            const searchText = [
                product.additionalInfo || '',
                product.description || '',
                product.name || ''
            ].join(' ').toLowerCase();
            
            if (!searchText.includes('pla')) {
                return false;
            }
            
            // Then check if product has at least one allowed color
            if (!product.colors || (Array.isArray(product.colors) && product.colors.length === 0)) {
                return false;
            }
            
            const colors = Array.isArray(product.colors) 
                ? product.colors 
                : product.colors.split(/(?=[A-Z])/);
            
            return colors.some(color => isAllowedColor(color));
        })
        .map(product => {
            // Filter out non-allowed colors from the product
            const colors = Array.isArray(product.colors) 
                ? product.colors 
                : product.colors.split(/(?=[A-Z])/);
            
            const filteredColors = colors.filter(color => isAllowedColor(color));
            
            // Filter colorImages to only include allowed colors
            const filteredColorImages = {};
            if (product.colorImages) {
                filteredColors.forEach(color => {
                    if (product.colorImages[color]) {
                        filteredColorImages[color] = product.colorImages[color];
                    }
                });
            }
            
            return {
                ...product,
                colors: filteredColors,
                colorImages: Object.keys(filteredColorImages).length > 0 ? filteredColorImages : product.colorImages
            };
        });

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                <div className="flex flex-col items-end pt-12">
                    <p className="text-2xl font-medium">3D Printed Products</p>
                    <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                </div>
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
