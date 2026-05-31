"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import {
  getShopCategoryBySlug,
  filterProductsByShopCategory,
  SHOP_CATEGORIES,
} from "@/lib/productCategories";

export default function ShopCategoryPage() {
  const { slug } = useParams();
  const { products, setIsLoading } = useAppContext();
  const shopCategory = getShopCategoryBySlug(slug);

  useEffect(() => {
    setIsLoading(false);
    const timeout = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timeout);
  }, [setIsLoading]);

  if (!shopCategory) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-6">
          <h1 className="text-xl font-medium text-gray-800">Category not found</h1>
          <Link href="/" className="mt-4 text-orange-600 hover:underline">
            Back to home
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const categoryProducts = filterProductsByShopCategory(products, shopCategory);
  const title = shopCategory.navLabel || shopCategory.name;

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
        <nav className="text-sm text-gray-500 pt-8 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-orange-600">
            Home
          </Link>
          <span>&gt;</span>
          <span className="text-gray-800">{title}</span>
        </nav>

        <div className="flex flex-col items-start w-full pt-4">
          <h1 className="text-2xl font-medium text-left">{title}</h1>
          <div className="h-0.5 w-full max-w-md rounded-full bg-orange-600 mt-1" />
        </div>

        {shopCategory.description && (
          <p className="mt-6 max-w-xl text-sm text-left leading-relaxed text-gray-600">
            {shopCategory.description}
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
          {categoryProducts.map((product, index) => (
            <ProductCard key={product._id || index} product={product} />
          ))}
        </div>

        {categoryProducts.length === 0 && (
          <div className="w-full text-center py-12">
            <p className="text-gray-500">No products in this category yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Check back soon or browse other categories.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {SHOP_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/shop/${cat.slug}`}
                  className="text-sm px-3 py-1.5 border border-gray-300 rounded-full hover:border-orange-500 hover:text-orange-600 transition"
                >
                  {cat.navLabel}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
