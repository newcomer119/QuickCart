"use client";

import React from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import SellerProductForm from "@/components/seller/SellerProductForm";

const AddProduct = () => {
  const { getToken, setIsLoading } = useAppContext();

  const handleSubmit = async (formData, { files, selectedColorImages }) => {
    if (files.filter(Boolean).length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    if (Object.keys(selectedColorImages).length === 0) {
      toast.error("Please select at least one color");
      return;
    }

    const missingColorImage = Object.entries(selectedColorImages).some(
      ([, file]) => !file
    );
    if (missingColorImage) {
      toast.error("Please upload an image for each selected color");
      return;
    }

    try {
      setIsLoading(true);
      const token = await getToken();
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }
      const { data } = await axios.post("/api/product/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (data.success) {
        toast.success(data.message);
        window.location.reload();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      toast.error(error.message || "Error uploading product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <SellerProductForm mode="add" submitLabel="ADD" onSubmit={handleSubmit} />
    </div>
  );
};

export default AddProduct;
