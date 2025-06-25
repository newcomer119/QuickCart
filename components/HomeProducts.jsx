import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { products, router, setIsLoading, isLoading } = useAppContext();

  const handleSeeMore = () => {
    setIsLoading(true);
    router.push("/all-products");
  };

  return (
    <div className="flex flex-col items-center pt-14">
      <p className="text-2xl font-medium text-left w-full">Popular products</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
        {isLoading && products.length === 0
          ? [...Array(10)].map((_, index) => (
              <div
                key={index}
                className="w-full h-64 bg-gray-200 animate-pulse rounded-lg"
              ></div>
            ))
          : products
              .slice(0, 10)
              .map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
      </div>
      {products.length === 0 && !isLoading && <p>No products found</p>}
      {products.length > 10 && (
        <button
          onClick={handleSeeMore}
          className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
        >
          See more
        </button>
      )}
    </div>
  );
};

export default HomeProducts;
