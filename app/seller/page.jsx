'use client'
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { FILAMENT_CATEGORY } from "@/lib/productCategories";
import { AVAILABLE_COLORS } from "@/lib/productColors";

const AddProduct = () => {
  const {getToken, setIsLoading} = useAppContext()
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [overview, setOverview] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [idealFor, setidealFor] = useState('');
  const [keyFeatures, setKeyFeatures] = useState('');
  const [compatibility, setCompatibility] = useState('');
  const [technicalSpecifications, setTechnicalSpecifications] = useState('');
  const [category, setCategory] = useState('3D Printed Wordart');
  const [materialType, setMaterialType] = useState('PLA+');
  const [selectedColorImages, setSelectedColorImages] = useState({});
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [length, setLength] = useState('');
  const [height, setHeight] = useState('');
  const [depth, setDepth] = useState('');
  const [weight, setWeight] = useState('');
  const [boxIncludes, setBoxIncludes] = useState('');
  const [careInstructions, setCareInstructions] = useState('');
  const [faq1, setFaq1] = useState('');
  const [faq2, setFaq2] = useState('');
  const [faq3, setFaq3] = useState('');
  const [faq4, setFaq4] = useState('');

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

    if (Object.keys(selectedColorImages).length === 0) {
      toast.error("Please select at least one color");
      return;
    }

    const missingImage = Object.entries(selectedColorImages).some(([item, file]) => !file);
    if (missingImage) {
      toast.error("Please upload an image for each selected color");
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('overview', overview);
    formData.append('additionalInfo', additionalInfo);
    formData.append('idealFor', idealFor);
    formData.append('keyFeatures', keyFeatures);
    formData.append('compatibility', compatibility);
    formData.append('technicalSpecifications', technicalSpecifications);
    formData.append('category', category);
    formData.append('materialType', materialType);
    formData.append('colors', JSON.stringify(Object.keys(selectedColorImages)));
    formData.append('price', price);
    formData.append('offerPrice', offerPrice);
    formData.append('length', length);
    formData.append('height', height);
    formData.append('depth', depth);
    formData.append('weight', weight);
    formData.append('boxIncludes', boxIncludes);
    formData.append('careInstructions', careInstructions);
    formData.append('faq1', faq1);
    formData.append('faq2', faq2);
    formData.append('faq3', faq3);
    formData.append('faq4', faq4);

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
        setOverview('');
        setAdditionalInfo('');
        setidealFor('');
        setKeyFeatures('');
        setCompatibility('');
        setTechnicalSpecifications('');
        setCategory('3D Printed Wordart');
        setMaterialType('PLA+');
        setSelectedColorImages({});
        setPrice('');
        setOfferPrice('');
        setLength('');
        setHeight('');
        setDepth('');
        setWeight('');
        setBoxIncludes('');
        setCareInstructions('');
        setFaq1('');
        setFaq2('');
        setFaq3('');
        setFaq4('');
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
          <p className="text-base font-medium">Add Product Images</p>
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
            placeholder="Add product name here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-overview"
          >
            Product Overview
          </label>
          <textarea
            id="product-overview"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Add overview for product here"
            onChange={(e) => setOverview(e.target.value)}
            value={overview}
            required
          ></textarea>
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
            placeholder="Add a long description for product here"
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
            Material and Build Quality
          </label>
          <textarea
            id="additional-info"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Enter material and build quality details here"
            onChange={(e) => setAdditionalInfo(e.target.value)}
            value={additionalInfo}
          ></textarea>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="ideal-for"
          >
            Add Product Ideal Cases
          </label>
          <textarea
            id="ideal-for"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Add ideal use cases for product here"
            onChange={(e) => setidealFor(e.target.value)}
            value={idealFor}
          ></textarea>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="key-features"
          >
            Add Product Key Features
          </label>
          <textarea
            id="key-features"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Add key features for product here"
            onChange={(e) => setKeyFeatures(e.target.value)}
            value={keyFeatures}
          ></textarea>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-compatibility"
          >
            Add Product Compatibility Details
          </label>
          <textarea
            id="product-compatibility"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Add compatibility details for product here"
            onChange={(e) => setCompatibility(e.target.value)}
            value={compatibility}
          ></textarea>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="technical-specifications"
          >
            Add Product's Technical Specifications
          </label>
          <textarea
            id="technical-specifications"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Add technical specifications for product here"
            onChange={(e) => setTechnicalSpecifications(e.target.value)}
            value={technicalSpecifications}
          ></textarea>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="box-includes"
          >
            What's included in the box?
          </label>
          <textarea
            id="box-includes"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Add items included in the box for product here"
            onChange={(e) => setBoxIncludes(e.target.value)}
            value={boxIncludes}
          ></textarea>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="care-instructions"
          >
            Add Product Care Instructions
          </label>
          <textarea
            id="care-instructions"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Add care instructions for product here"
            onChange={(e) => setCareInstructions(e.target.value)}
            value={careInstructions}
          ></textarea>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="faq-1"
          >
            FAQ 1
          </label>
          <textarea
            id="faq-1"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Add FAQ 1 for product here"
            onChange={(e) => setFaq1(e.target.value)}
            value={faq1}
          ></textarea>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="faq-2"
          >
            FAQ 2
          </label>
          <textarea
            id="faq-2"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Add FAQ 2 for product here"
            onChange={(e) => setFaq2(e.target.value)}
            value={faq2}
          ></textarea>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="faq-3"
          >
            FAQ 3
          </label>
          <textarea
            id="faq-3"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Add FAQ 3 for product here"
            onChange={(e) => setFaq3(e.target.value)}
            value={faq3}
          ></textarea>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="faq-4"
          >
            FAQ 4
          </label>
          <textarea
            id="faq-4"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Add FAQ 4 for product here"
            onChange={(e) => setFaq4(e.target.value)}
            value={faq4}
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
              <option value="3D Printed Wordart">3D Printed Wordart</option>
              <option value="3D Printed Desk Essentials">3D Printed Desk Essentials</option>
              <option value="3D Printed Lamps">3D Printed Lamps</option>
              <option value="3D Printed Keychain">3D Printed Keychain</option>
              <option value="3D Printed Decor Essentials">3D Printed Decor Essentials</option>
              <option value="3D Printed Laptop Accessories">3D Printed Laptop Accessories</option>
              <option value="Accessories">3D Printed Gaming Accessories</option>
              <option value={FILAMENT_CATEGORY}>{FILAMENT_CATEGORY}</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="material-type">
              Material Type
            </label>
            <select
              id="material-type"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setMaterialType(e.target.value)}
              value={materialType}
            >
              <option value="PLA+">PLA +</option>
              <option value="PLA">PLA</option>
              <option value="PLA Matte">PLA Matte</option>
              <option value="PLA Wood">PLA Wood</option>
              <option value="PLA Marble">PLA Marble</option>
              <option value="PETG">PETG</option>
              <option value="ABS">ABS</option>
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
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="length">
              Length (cm)
            </label>
            <input
              id="length"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setLength(e.target.value)}
              value={length}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="height">
              Height (cm)
            </label>
            <input
              id="height"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setHeight(e.target.value)}
              value={height}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="depth">
              Depth (cm)
            </label>
            <input
              id="depth"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setDepth(e.target.value)}
              value={depth}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="weight">
              Weight (gms)
            </label>
            <input
              id="weight"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setWeight(e.target.value)}
              value={weight}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Available Colors</label>
          <div className="flex flex-wrap gap-3 mt-2">
            {AVAILABLE_COLORS.map((item) => (
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