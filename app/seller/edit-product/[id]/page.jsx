"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import SellerProductForm from "@/components/seller/SellerProductForm";
import { normalizeProductCategory } from "@/lib/productCategories";

function productToFormState(product) {
  const colorImages = {};
  (product.colors || []).forEach((color) => {
    colorImages[color] = product.colorImages?.[color] || null;
  });

  return {
    initialValues: {
      name: product.name || "",
      description: product.description || "",
      overview: product.overview || "",
      additionalInfo: product.additionalInfo || "",
      idealFor: product.idealFor || "",
      keyFeatures: product.keyFeatures || "",
      compatibility: product.compatibility || "",
      technicalSpecifications: product.technicalSpecifications || "",
      category: normalizeProductCategory(product.category),
      materialType: product.materialType || "PLA+",
      price: product.price != null ? String(product.price) : "",
      offerPrice: product.offerPrice != null ? String(product.offerPrice) : "",
      length: product.length != null ? String(product.length) : "",
      height: product.height != null ? String(product.height) : "",
      depth: product.depth != null ? String(product.depth) : "",
      weight: product.weight != null ? String(product.weight) : "",
      boxIncludes: product.boxIncludes || "",
      careInstructions: product.careInstructions || "",
      faq1: product.faq1 || "",
      faq2: product.faq2 || "",
      faq3: product.faq3 || "",
      faq4: product.faq4 || "",
    },
    initialImages: product.image || [],
    initialColorImages: colorImages,
  };
}

const EditProduct = () => {
  const { id } = useParams();
  const router = useRouter();
  const { getToken, setIsLoading, isLoading } = useAppContext();
  const [formState, setFormState] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const token = await getToken();
        const { data } = await axios.get(`/api/product/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          setFormState(productToFormState(data.product));
        } else {
          toast.error(data.message);
          router.push("/seller/product-list");
        }
      } catch (error) {
        toast.error("Failed to fetch product data.");
        console.error(error);
        router.push("/seller/product-list");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [id, getToken, setIsLoading, router]);

  const handleSubmit = async (formData, { selectedColorImages, existingColorImages }) => {
    if (Object.keys(selectedColorImages).length === 0) {
      toast.error("Please select at least one color");
      return;
    }

    const missingColorImage = Object.entries(selectedColorImages).some(
      ([color, file]) => !file && !existingColorImages[color]
    );
    if (missingColorImage) {
      toast.error("Please upload an image for each selected color");
      return;
    }

    setIsLoading(true);
    try {
      const token = await getToken();
      const { data } = await axios.put(`/api/product/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success("Product updated successfully!");
        router.push("/seller/product-list");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.message || "Error updating product");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !formState) {
    return <Loading />;
  }

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <SellerProductForm
        key={id}
        mode="edit"
        title="Edit Product"
        submitLabel="Update Product"
        initialValues={formState.initialValues}
        initialImages={formState.initialImages}
        initialColorImages={formState.initialColorImages}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditProduct;
