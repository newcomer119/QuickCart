import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const { currency, router, user, setIsLoading, cartItems } = useAppContext()

    const handleProductClick = () => {
        setIsLoading(true);
        router.push('/product/' + product._id);
        scrollTo(0, 0);
    };

    const handleBuyNow = (e) => {
        e.stopPropagation();
        if (!user) {
            toast.error("Please login first to buy products");
            router.push('/');
            return;
        }
        setIsLoading(true);
        router.push('/product/' + product._id);
    };

    // Check if this product is in cart (handle both old and new cart structure)
    const isInCart = () => {
        // Check for exact product match (old format)
        if (cartItems[product._id]) {
            return true;
        }
        
        // Check for color variants (new format)
        if (product.colors) {
            const colors = Array.isArray(product.colors) ? product.colors : product.colors.split(/(?=[A-Z])/);
            return colors.some(color => cartItems[`${product._id}_${color}`]);
        }
        
        return false;
    };

    return (
        <div
            onClick={handleProductClick}
            className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
        >
            <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center">
                <Image
                    src={product.image[0]}
                    alt={product.name}
                    className="group-hover:scale-105 transition object-contain w-full h-60 p-2"
                    width={400}
                    height={240}
                />
            </div>

            <p className="md:text-base font-medium pt-2 w-full truncate">{product.name}</p>
            <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">{
              product.description && product.description.length > 50
                ? product.description.slice(0, 50) + '...'
                : product.description
            }</p>
            <p className="w-full text-xs text-gray-500/70 max-sm:hidden">
              Color: {product.colors && product.colors.length > 0 
                ? (Array.isArray(product.colors) 
                    ? (product.colors.length > 1 
                        ? `${product.colors.length} colors available` 
                        : product.colors[0]
                      )
                    : (product.colors.split(/(?=[A-Z])/).length > 1
                        ? `${product.colors.split(/(?=[A-Z])/).length} colors available`
                        : product.colors
                      )
                  )
                : "No different colors"
              }
            </p>
            <div className="flex items-center gap-2">
                <p className="text-xs">{4.5}</p>
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Image
                            key={index}
                            className="h-3 w-3"
                            src={
                                index < Math.floor(4)
                                    ? assets.star_icon
                                    : assets.star_dull_icon
                            }
                            alt="star_icon"
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-end justify-between w-full mt-1">
                <div className="flex flex-col w-full">
                    <p className="text-xs text-gray-500/80">Category: {product.category}</p>
                    {product.additionalInfo && (
                        <p className="text-xs text-gray-500/80">{
                          product.additionalInfo.length > 40
                            ? product.additionalInfo.slice(0, 40) + '...'
                            : product.additionalInfo
                        }</p>
                    )}
                    <p className="text-base font-medium mt-1">{currency}{product.offerPrice}</p>
                </div>
                <button 
                    onClick={handleBuyNow}
                    className="max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition"
                >
                    Buy now
                </button>
            </div>
        </div>
    )
}

export default ProductCard