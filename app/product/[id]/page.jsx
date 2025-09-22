"use client";
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import toast from "react-hot-toast";

const Product = () => {
  const { id } = useParams();
  const router = useRouter();

  const { products, router: appRouter, addToCart, user, cartItems, setIsLoading } = useAppContext();

  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedColorImage, setSelectedColorImage] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);

  const fetchProductData = async () => {
    setIsProductLoading(true);
    const product = products.find((product) => product._id === id);
    setProductData(product);
    if (product && product.colors) {
      if (Array.isArray(product.colors) && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
        setSelectedColorImage(product.colorImages ? product.colorImages[product.colors[0]] : null);
      } else if (typeof product.colors === 'string') {
        const firstColor = product.colors.split(/(?=[A-Z])/)[0];
        setSelectedColor(firstColor);
        setSelectedColorImage(product.colorImages ? product.colorImages[firstColor] : null);
      }
    }
    setIsProductLoading(false);
  };

  useEffect(() => {
    fetchProductData();
  }, [id, products.length]);

  useEffect(() => {
    // Stop loading when product data is processed (found or not found)
    if (!isProductLoading) {
      setIsLoading(false);
    }
  }, [isProductLoading, setIsLoading]);

  // Fallback: stop loading after 3 seconds to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [setIsLoading]);

  const handleColorSelect = (color) => {
    if (selectedColor === color) {
      setSelectedColor('');
      setSelectedColorImage(null);
    } else {
      setSelectedColor(color);
      setSelectedColorImage(productData.colorImages ? productData.colorImages[color] : null);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login first to add items to cart");
      appRouter.push('/');
      return;
    }
    const hasMultipleColors = productData.colors && (
      (Array.isArray(productData.colors) && productData.colors.length > 1) ||
      (typeof productData.colors === 'string' && productData.colors.split(/(?=[A-Z])/).length > 1)
    );
    if (hasMultipleColors && !selectedColor) {
      const message = productData.category === "Organics by Filament Freaks" 
        ? "Please select a fragrance" 
        : "Please select a color";
      toast.error(message);
      return;
    }
    addToCart(productData._id, selectedColor, selectedColorImage);
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please login first to buy products");
      appRouter.push('/');
      return;
    }
    const hasMultipleColors = productData.colors && (
      (Array.isArray(productData.colors) && productData.colors.length > 1) ||
      (typeof productData.colors === 'string' && productData.colors.split(/(?=[A-Z])/).length > 1)
    );
    if (hasMultipleColors && !selectedColor) {
      const message = productData.category === "Organics by Filament Freaks" 
        ? "Please select a fragrance" 
        : "Please select a color";
      toast.error(message);
      return;
    }
    const cartKey = selectedColor ? `${productData._id}_${selectedColor}` : productData._id;
    if (!cartItems[cartKey]) {
      addToCart(productData._id, selectedColor, selectedColorImage);
    }
    appRouter.push("/cart");
  };

  if (isProductLoading) {
    return <Loading />;
  }

  if (!productData) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
          <h1 className="text-2xl font-medium text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => router.push('/all-products')}
            className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          >
            Browse All Products
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      {/* Zoom Modal for color image */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative" onClick={e => e.stopPropagation()}>
            <img
              src={zoomedImage}
              alt="Zoomed"
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg border-2 border-white shadow-lg"
            />
            <button
              className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 text-gray-700 hover:bg-opacity-100"
              onClick={() => setZoomedImage(null)}
            >
              &#10005;
            </button>
          </div>
        </div>
      )}
      <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="px-5 lg:px-16 xl:px-20">
            <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
              <Image
                src={mainImage || productData.image[0]}
                alt="alt"
                className="w-full h-auto object-cover mix-blend-multiply"
                width={1280}
                height={720}
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {productData.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setMainImage(image)}
                  className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
                >
                  <Image
                    src={image}
                    alt="alt"
                    className="w-full h-auto object-cover mix-blend-multiply"
                    width={1280}
                    height={720}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
              {productData.name}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <Image
                  className="h-4 w-4"
                  src={assets.star_icon}
                  alt="star_icon"
                />
                <Image
                  className="h-4 w-4"
                  src={assets.star_icon}
                  alt="star_icon"
                />
                <Image
                  className="h-4 w-4"
                  src={assets.star_icon}
                  alt="star_icon"
                />
                <Image
                  className="h-4 w-4"
                  src={assets.star_icon}
                  alt="star_icon"
                />
                <Image
                  className="h-4 w-4"
                  src={assets.star_dull_icon}
                  alt="star_dull_icon"
                />
              </div>
              <p>(4.5)</p>
            </div>
            <p className="text-gray-600 mt-3">{productData.description}</p>
            {productData.additionalInfo && (
              <>
                <p className="mt-4 mb-1 text-base font-medium text-gray-700">Additional Info</p>
                <div className="text-gray-600 text-sm">
                  {productData.additionalInfo.split('\n').map((info, idx) => (
                    <div key={idx}>{info}</div>
                  ))}
                </div>
              </>
            )}
            <p className="text-3xl font-medium mt-6">
              ₹{productData.offerPrice}
              <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                ₹{productData.price}
              </span>
            </p>
            <hr className="bg-gray-600 my-6" />
            
            {/* Color/Fragrance Selection */}
            {productData.colors && productData.colors.length > 0 ? (
              <div className="mb-6">
                <p className="text-base font-medium mb-3">
                  {productData.category === "Organics by Filament Freaks" ? "Select Fragrance:" : "Select Color:"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(productData.colors) ? (
                    productData.colors.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleColorSelect(item)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                          selectedColor === item
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } flex items-center gap-2`}
                      >
                        {productData.colorImages && productData.colorImages[item] && (
                          <img
                            src={productData.colorImages[item]}
                            alt={item}
                            className="w-6 h-6 rounded-full border border-gray-300"
                          />
                        )}
                        {item}
                      </button>
                    ))
                  ) : (
                    productData.colors.split(/(?=[A-Z])/).map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleColorSelect(item)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                          selectedColor === item
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } flex items-center gap-2`}
                      >
                        {productData.colorImages && productData.colorImages[item] && (
                          <img
                            src={productData.colorImages[item]}
                            alt={item}
                            className="w-6 h-6 rounded-full border border-gray-300"
                          />
                        )}
                        {item}
                      </button>
                    ))
                  )}
                </div>
                {selectedColor && (
                  <div className="flex flex-col items-start gap-2 mt-2">
                    {selectedColorImage && (
                      <img
                        src={selectedColorImage}
                        alt={selectedColor}
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300 bg-gray-100 mb-2 cursor-zoom-in"
                        onClick={() => setZoomedImage(selectedColorImage)}
                      />
                    )}
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Selected:</span>
                      <span className="font-medium text-sm">{selectedColor}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-base font-medium mb-3">
                  {productData.category === "Organics by Filament Freaks" ? "Fragrance:" : "Color:"}
                </p>
                <p className="text-gray-600">
                  {productData.category === "Organics by Filament Freaks" ? "No different fragrances" : "No different colors"}
                </p>
              </div>
            )}
            {/* Debug info - remove this later */}
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse w-full max-w-72">
                <tbody>
                  <tr>
                    <td className="text-gray-600 font-medium">Brand</td>
                    <td className="text-gray-800/50 ">Filament Freaks</td>
                  </tr>
                  <tr>
                    <td className="text-gray-600 font-medium">
                      {productData.category === "Organics by Filament Freaks" ? "Fragrance" : "Color"}
                    </td>
                    <td className="text-gray-800/50 ">
                      {productData.colors && productData.colors.length > 0 ? (
                        Array.isArray(productData.colors) 
                          ? (productData.colors.length > 1 
                              ? `${productData.colors.length} ${productData.category === "Organics by Filament Freaks" ? "fragrances" : "colors"} available`
                              : productData.colors[0]
                            )
                          : (productData.colors.split(/(?=[A-Z])/).length > 1
                              ? `${productData.colors.split(/(?=[A-Z])/).length} ${productData.category === "Organics by Filament Freaks" ? "fragrances" : "colors"} available`
                              : productData.colors
                            )
                      ) : (
                        productData.category === "Organics by Filament Freaks" ? "No different fragrances" : "No different colors"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-600 font-medium">Category</td>
                    <td className="text-gray-800/50">{productData.category}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex items-center mt-10 gap-4">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-4 mt-16">
            <p className="text-3xl font-medium">
              Featured{" "}
              <span className="font-medium text-orange-600">Products</span>
            </p>
            <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
            {products
              .filter(product => product._id !== id)
              .slice(0, 5)
              .map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
          <button 
            onClick={() => router.push('/all-products')}
            className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
          >
            See more
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;