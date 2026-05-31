"use client";
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { FiCheck, FiMinus, FiPlus } from "react-icons/fi";
import { getCategoryHref } from "@/lib/productCategories";
import {
  ProductDescriptionSection,
  KeyFeaturesSection,
  MaterialSection,
  SpecsAndDimensionsSection,
  DimensionsWeightTable,
  CompatibilitySection,
  IdealForSection,
  IncludedAndCareSection,
  FaqSection,
  TrustBar,
} from "@/components/ProductDetailSections";

const TRUST_BADGES = [
  { label: "Premium Quality", sub: "3D Print" },
  { label: "Made in India", sub: "Proudly Designed" },
  { label: "Secure Packaging", sub: "Safe Delivery" },
];

const Product = () => {
  const { id } = useParams();
  const router = useRouter();
  const {
    products,
    router: appRouter,
    addToCart,
    updateCartQuantity,
    user,
    cartItems,
    setIsLoading,
  } = useAppContext();

  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedColorImage, setSelectedColorImage] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const fetchProductData = async () => {
    setIsProductLoading(true);
    const product = products.find((p) => p._id === id);
    setProductData(product);
    if (product?.colors) {
      if (Array.isArray(product.colors) && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
        setSelectedColorImage(
          product.colorImages ? product.colorImages[product.colors[0]] : null
        );
      } else if (typeof product.colors === "string") {
        const firstColor = product.colors.split(/(?=[A-Z])/)[0];
        setSelectedColor(firstColor);
        setSelectedColorImage(
          product.colorImages ? product.colorImages[firstColor] : null
        );
      }
    }
    setIsProductLoading(false);
  };

  useEffect(() => {
    fetchProductData();
  }, [id, products.length]);

  useEffect(() => {
    if (!isProductLoading) setIsLoading(false);
  }, [isProductLoading, setIsLoading]);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timeout);
  }, [setIsLoading]);

  const getColorsList = () => {
    if (!productData?.colors) return [];
    return Array.isArray(productData.colors)
      ? productData.colors
      : productData.colors.split(/(?=[A-Z])/);
  };

  const hasMultipleColors = () => {
    const list = getColorsList();
    return list.length > 1;
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedColorImage(
      productData.colorImages ? productData.colorImages[color] : null
    );
  };

  const validateColor = () => {
    if (hasMultipleColors() && !selectedColor) {
      toast.error("Please select a color");
      return false;
    }
    return true;
  };

  const syncCartQuantity = async () => {
    if (quantity <= 1) return;
    await updateCartQuantity(
      productData._id,
      quantity,
      selectedColor || null,
      selectedColorImage
    );
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login first to add items to cart");
      appRouter.push("/");
      return;
    }
    if (!validateColor()) return;
    const cartKey = selectedColor
      ? `${productData._id}_${selectedColor}`
      : productData._id;
    if (!cartItems[cartKey]) {
      await addToCart(
        productData._id,
        selectedColor || null,
        selectedColorImage
      );
    }
    if (quantity > 1) await syncCartQuantity();
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error("Please login first to buy products");
      appRouter.push("/");
      return;
    }
    if (!validateColor()) return;
    const cartKey = selectedColor
      ? `${productData._id}_${selectedColor}`
      : productData._id;
    if (!cartItems[cartKey]) {
      await addToCart(
        productData._id,
        selectedColor || null,
        selectedColorImage
      );
    }
    if (quantity > 1) await syncCartQuantity();
    appRouter.push("/cart");
  };

  if (isProductLoading) return <Loading />;

  if (!productData) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
          <h1 className="text-2xl font-medium text-gray-800 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => router.push("/all-products")}
            className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          >
            Browse All Products
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const images = productData.image || [];
  const displayImage = mainImage || images[0];
  const shortText = productData.overview || productData.description;

  return (
    <>
      <Navbar />
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={zoomedImage}
              alt="Zoomed"
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg border-2 border-white shadow-lg"
            />
            <button
              type="button"
              className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-gray-700"
              onClick={() => setZoomedImage(null)}
            >
              &#10005;
            </button>
          </div>
        </div>
      )}

      <div className="px-4 md:px-16 lg:px-32 pt-6 pb-4">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-orange-600">
            Home
          </Link>
          <span>&gt;</span>
          <Link
            href={getCategoryHref(productData.category)}
            className="hover:text-orange-600"
          >
            {productData.category}
          </Link>
          <span>&gt;</span>
          <span className="text-gray-800 truncate max-w-[200px] md:max-w-none">
            {productData.name}
          </span>
        </nav>

        {/* Above the fold */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div className="flex gap-3 md:gap-4">
            {images.length > 1 && (
              <div className="flex flex-col gap-2 shrink-0">
                {images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setMainImage(image)}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition ${
                      (mainImage || images[0]) === image
                        ? "border-orange-500"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image}
                      alt=""
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 rounded-xl overflow-hidden bg-gray-100 aspect-square relative">
              <Image
                src={displayImage}
                alt={productData.name}
                fill
                className="object-cover mix-blend-multiply"
                priority
              />
            </div>
          </div>

          {/* Product info */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2 font-serif">
              {productData.name}
            </h1>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4].map((i) => (
                  <Image
                    key={i}
                    className="h-4 w-4"
                    src={assets.star_icon}
                    alt=""
                    width={16}
                    height={16}
                  />
                ))}
                <Image
                  className="h-4 w-4"
                  src={assets.star_dull_icon}
                  alt=""
                  width={16}
                  height={16}
                />
              </div>
              <span className="text-sm text-gray-600">
                4.8{" "}
                <button type="button" className="text-orange-600 underline">
                  (128 reviews)
                </button>
              </span>
            </div>

            <p className="text-3xl font-bold text-gray-900">
              ₹{productData.offerPrice.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Inclusive of all taxes | Free shipping on orders above ₹999
            </p>
            {productData.price > productData.offerPrice && (
              <p className="text-sm text-gray-400 line-through mt-0.5">
                ₹{productData.price.toFixed(2)}
              </p>
            )}

            <p className="text-gray-600 mt-4 leading-relaxed line-clamp-4">
              {shortText}
            </p>

            <div className="grid grid-cols-3 gap-3 mt-6">
              {TRUST_BADGES.map((badge) => (
                <div
                  key={badge.label}
                  className="text-center p-3 border border-gray-200 rounded-lg bg-gray-50/50"
                >
                  <p className="text-xs font-semibold text-gray-800">
                    {badge.label}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    ({badge.sub})
                  </p>
                </div>
              ))}
            </div>

            {getColorsList().length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-800 mb-2">
                  Color
                </p>
                <div className="flex flex-wrap gap-2">
                  {getColorsList().map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition flex items-center gap-2 ${
                        selectedColor === color
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-gray-700 border-gray-300 hover:border-orange-400"
                      }`}
                    >
                      {productData.colorImages?.[color] && (
                        <img
                          src={productData.colorImages[color]}
                          alt=""
                          className="w-5 h-5 rounded-full object-contain"
                        />
                      )}
                      {color}
                    </button>
                  ))}
                </div>
                {selectedColorImage && (
                  <img
                    src={selectedColorImage}
                    alt={selectedColor}
                    className="w-24 h-24 object-cover rounded-lg border mt-2 cursor-zoom-in"
                    onClick={() => setZoomedImage(selectedColorImage)}
                  />
                )}
              </div>
            )}

            <div className="mt-6">
              <p className="text-sm font-medium text-gray-800 mb-2">
                Quantity
              </p>
              <div className="inline-flex items-center border border-gray-300 rounded-lg">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  aria-label="Decrease quantity"
                >
                  <FiMinus />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  aria-label="Increase quantity"
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition"
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 py-3.5 border-2 border-orange-500 text-orange-600 font-medium rounded-lg hover:bg-orange-50 transition"
              >
                Buy Now
              </button>
            </div>

            <p className="flex items-center gap-2 text-sm text-gray-500 mt-4">
              <FiCheck className="text-green-600" />
              Trusted by 10,000+ happy customers
            </p>
          </div>
        </div>

        {/* Below the fold */}
        <div className="max-w-5xl mx-auto">
          <ProductDescriptionSection description={productData.description} />
          <KeyFeaturesSection keyFeatures={productData.keyFeatures} />
          <MaterialSection
            additionalInfo={productData.additionalInfo}
            image={images[1] || images[0]}
          />
          <SpecsAndDimensionsSection product={productData} />
          <CompatibilitySection compatibility={productData.compatibility} />
          <IdealForSection idealFor={productData.idealFor} />
          <IncludedAndCareSection
            boxIncludes={productData.boxIncludes}
            careInstructions={productData.careInstructions}
          />
          <FaqSection product={productData} />
          <TrustBar />
        </div>

        {/* Related products */}
        <div className="flex flex-col items-center mt-10">
          <div className="flex flex-col items-center mb-4">
            <p className="text-3xl font-medium">
              Featured{" "}
              <span className="font-medium text-orange-600">Products</span>
            </p>
            <div className="w-28 h-0.5 bg-orange-600 mt-2" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
            {products
              .filter((p) => p._id !== id)
              .slice(0, 5)
              .map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
          </div>
          <button
            type="button"
            onClick={() => router.push("/all-products")}
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
