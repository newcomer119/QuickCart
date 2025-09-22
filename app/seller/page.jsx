'use client'
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const AddProduct = () => {
  const {getToken, setIsLoading} = useAppContext()
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [category, setCategory] = useState('Earphone');
  const [selectedColorImages, setSelectedColorImages] = useState({});
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');

  const availableColors = [
    'Pitch black',
    'Pure white', 
    'Lemon yellow',
    'Mauve purple',
    'Nuclear red',
    'Outrageous orange',
    'Atomic pink',
    'Royal blue',
    'Light grey',
    'Light blue',
    'Grass green',
    'Beige brown',
    'Teal blue',
    'Army green',
    'Dark grey',
    'Ivory white',
    'Rust copper',
    'Appricot',
    'Lagoon blue',
    'Forest green',
    'Fluorescent orange',
    'Fluorescent green',
    'Transparent',
    'Bhama yellow',
    'Chocolate brown',
    'Fluorescent yellow',
    'Levender violet',
    'Magenta',
    'Military khaki',
    'Ryobix green',
    'Simply silver',
    'Midnight grey',
    'Thanos purple',
    'Cool( lithopane ) white'
  ];

  const availableFragrances = [
    'JASMINE',
    'ASHTAGANDHA',
    'KESAR CHANDAN',
    'LAVENDER',
    'MOGRA',
    'GULAB',
    'LOBHAN',
    'KAPOOR',
    'GUGAL'
  ];

  const handleColorChange = (color) => {
    setSelectedColorImages(prev => {
      if (prev[color] !== undefined) {
        // Deselect: remove color
        const updated = { ...prev };
        delete updated[color];
        return updated;
      } else {
        // Select: add color with no image yet
        return { ...prev, [color]: null };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if any files are selected
    if (files.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    // Check if at least one color/fragrance is selected
    if (Object.keys(selectedColorImages).length === 0) {
      const message = category === "Organics by Filament Freaks" 
        ? "Please select at least one fragrance" 
        : "Please select at least one color";
      toast.error(message);
      return;
    }

    // Check if every selected color/fragrance has an image
    const missingImage = Object.entries(selectedColorImages).some(([item, file]) => !file);
    if (missingImage) {
      const message = category === "Organics by Filament Freaks" 
        ? "Please upload an image for each selected fragrance" 
        : "Please upload an image for each selected color";
      toast.error(message);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('additionalInfo', additionalInfo);
    formData.append('category', category);
    formData.append('colors', JSON.stringify(Object.keys(selectedColorImages)));
    formData.append('price', price);
    formData.append('offerPrice', offerPrice);

    // Append each file to formData
    files.forEach((file, index) => {
      if (file) {
        formData.append('images', file);
      }
    });

    // Append each color image
    Object.entries(selectedColorImages).forEach(([color, file]) => {
      if (file) {
        formData.append(`colorImages[${color}]`, file);
      }
    });

    try {
      setIsLoading(true); // Start loading
      const token = await getToken();
      if (!token) {
        toast.error("Authentication token not found");
        setIsLoading(false); // Stop loading
        return;
      }
      const { data } = await axios.post('/api/product/add', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setIsLoading(false); // Stop loading
      if (data.success) {
        toast.success(data.message);
        // Reset form
        setFiles([]);
        setName('');
        setDescription('');
        setAdditionalInfo('');
        setCategory('Earphone');
        setSelectedColorImages({});
        setPrice('');
        setOfferPrice('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      setIsLoading(false); // Stop loading on error
      console.error("Error uploading product:", error);
      toast.error(error.message || "Error uploading product");
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input 
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }
                  }} 
                  type="file" 
                  id={`image${index}`} 
                  accept="image/*"
                  hidden 
                />
                <Image
                  key={index}
                  className="max-w-24 cursor-pointer"
                  src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="additional-info"
          >
            Additional Product Info
          </label>
          <textarea
            id="additional-info"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Enter any additional information here..."
            onChange={(e) => setAdditionalInfo(e.target.value)}
            value={additionalInfo}
          ></textarea>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="Earphone">Earphone</option>
              <option value="Headphone">Headphone</option>
              <option value="Watch">Watch</option>
              <option value="Smartphone">Smartphone</option>
              <option value="Laptop">Laptop</option>
              <option value="Camera">Camera</option>
              <option value="Accessories">Accessories</option>
              <option value="Organics by Filament Freaks">Organics by Filament Freaks</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
        </div>

        {/* Color/Fragrance Selection */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">
            {category === "Organics by Filament Freaks" ? "Available Fragrances" : "Available Colors"}
          </label>
          <div className="flex flex-wrap gap-3 mt-2">
            {(category === "Organics by Filament Freaks" ? availableFragrances : availableColors).map((item) => (
              <div key={item} className="flex flex-col items-start">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedColorImages[item] !== undefined}
                    onChange={() => handleColorChange(item)}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm">{item}</span>
                </label>
                {selectedColorImages[item] !== undefined && (
                  <div className="mt-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files[0];
                        setSelectedColorImages(prev => ({
                          ...prev,
                          [item]: file || null
                        }));
                      }}
                    />
                    {selectedColorImages[item] && (
                      <img
                        src={URL.createObjectURL(selectedColorImages[item])}
                        alt={`${item} preview`}
                        className="w-16 h-16 object-cover mt-1"
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          {Object.keys(selectedColorImages).length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Selected: {Object.keys(selectedColorImages).join(', ')}
            </p>
          )}
        </div>

        <button type="submit" className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded">
          ADD
        </button>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;