"use client";

import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { SHOP_CATEGORIES } from "@/lib/productCategories";
import { AVAILABLE_COLORS } from "@/lib/productColors";

const MATERIAL_OPTIONS = [
  "PLA+",
  "PLA",
  "PLA Matte",
  "PLA Wood",
  "PLA Marble",
  "PETG",
  "ABS",
];

const emptyForm = {
  name: "",
  description: "",
  overview: "",
  additionalInfo: "",
  idealFor: "",
  keyFeatures: "",
  compatibility: "",
  technicalSpecifications: "",
  category: "3D Printed Wordart",
  materialType: "PLA+",
  price: "",
  offerPrice: "",
  length: "",
  height: "",
  depth: "",
  weight: "",
  boxIncludes: "",
  careInstructions: "",
  faq1: "",
  faq2: "",
  faq3: "",
  faq4: "",
};

/**
 * @param {Object} props
 * @param {"add"|"edit"} props.mode
 * @param {Object} [props.initialValues]
 * @param {string[]} [props.initialImages]
 * @param {Object} [props.initialColorImages]
 * @param {string} props.submitLabel
 * @param {string} [props.title]
 * @param {(formData: FormData) => Promise<void>} props.onSubmit
 */
export default function SellerProductForm({
  mode,
  initialValues = {},
  initialImages = [],
  initialColorImages = {},
  submitLabel,
  title,
  onSubmit,
}) {
  const merged = { ...emptyForm, ...initialValues };
  const [files, setFiles] = useState([]);
  const [name, setName] = useState(merged.name);
  const [description, setDescription] = useState(merged.description);
  const [overview, setOverview] = useState(merged.overview);
  const [additionalInfo, setAdditionalInfo] = useState(merged.additionalInfo);
  const [idealFor, setIdealFor] = useState(merged.idealFor);
  const [keyFeatures, setKeyFeatures] = useState(merged.keyFeatures);
  const [compatibility, setCompatibility] = useState(merged.compatibility);
  const [technicalSpecifications, setTechnicalSpecifications] = useState(
    merged.technicalSpecifications
  );
  const [category, setCategory] = useState(merged.category);
  const [materialType, setMaterialType] = useState(merged.materialType);
  const [selectedColorImages, setSelectedColorImages] = useState(
    initialColorImages || {}
  );
  const [price, setPrice] = useState(merged.price);
  const [offerPrice, setOfferPrice] = useState(merged.offerPrice);
  const [length, setLength] = useState(merged.length);
  const [height, setHeight] = useState(merged.height);
  const [depth, setDepth] = useState(merged.depth);
  const [weight, setWeight] = useState(merged.weight);
  const [boxIncludes, setBoxIncludes] = useState(merged.boxIncludes);
  const [careInstructions, setCareInstructions] = useState(
    merged.careInstructions
  );
  const [faq1, setFaq1] = useState(merged.faq1);
  const [faq2, setFaq2] = useState(merged.faq2);
  const [faq3, setFaq3] = useState(merged.faq3);
  const [faq4, setFaq4] = useState(merged.faq4);
  const [existingImages] = useState(initialImages);
  const [existingColorImages] = useState(initialColorImages);

  const isEdit = mode === "edit";

  const handleColorChange = (color) => {
    setSelectedColorImages((prev) => {
      if (prev[color] !== undefined) {
        const updated = { ...prev };
        delete updated[color];
        return updated;
      }
      return { ...prev, [color]: existingColorImages[color] || null };
    });
  };

  const buildFormData = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("overview", overview);
    formData.append("additionalInfo", additionalInfo);
    formData.append("idealFor", idealFor);
    formData.append("keyFeatures", keyFeatures);
    formData.append("compatibility", compatibility);
    formData.append("technicalSpecifications", technicalSpecifications);
    formData.append("category", category);
    formData.append("materialType", materialType);
    formData.append("colors", JSON.stringify(Object.keys(selectedColorImages)));
    formData.append("price", price);
    formData.append("offerPrice", offerPrice);
    formData.append("length", length);
    formData.append("height", height);
    formData.append("depth", depth);
    formData.append("weight", weight);
    formData.append("boxIncludes", boxIncludes);
    formData.append("careInstructions", careInstructions);
    formData.append("faq1", faq1);
    formData.append("faq2", faq2);
    formData.append("faq3", faq3);
    formData.append("faq4", faq4);

    if (isEdit) {
      const slots = [...Array(4)].map((_, i) => existingImages[i] || null);
      formData.append("existingImages", JSON.stringify(slots));
      files.forEach((file, index) => {
        if (file) formData.append(`imageSlot_${index}`, file);
      });
    } else {
      files.forEach((file) => {
        if (file) formData.append("images", file);
      });
    }

    Object.entries(selectedColorImages).forEach(([color, file]) => {
      if (file instanceof File) {
        formData.append(`colorImages[${color}]`, file);
      }
    });

    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(buildFormData(), {
      files,
      selectedColorImages,
      existingColorImages,
      existingImages,
    });
  };

  const getImagePreview = (index) => {
    if (files[index]) return URL.createObjectURL(files[index]);
    if (isEdit && existingImages[index]) return existingImages[index];
    return assets.upload_area;
  };

  const getColorPreview = (color) => {
    const val = selectedColorImages[color];
    if (val instanceof File) return URL.createObjectURL(val);
    if (val && typeof val === "string") return val;
    if (existingColorImages[color]) return existingColorImages[color];
    return null;
  };

  const fieldClass =
    "outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 w-full";

  return (
    <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
      {title && <h1 className="text-2xl font-semibold">{title}</h1>}

      <div>
        <p className="text-base font-medium">
          {isEdit ? "Product Images" : "Add Product Images"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {isEdit
            ? "Upload new images only for slots you want to replace."
            : "Upload up to 4 product images."}
        </p>
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
                className="max-w-24 cursor-pointer rounded object-cover"
                src={getImagePreview(index)}
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
          className={fieldClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1 max-w-md">
        <label className="text-base font-medium" htmlFor="product-overview">
          Product Overview
        </label>
        <textarea
          id="product-overview"
          rows={4}
          className={`${fieldClass} resize-none`}
          value={overview}
          onChange={(e) => setOverview(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1 max-w-md">
        <label className="text-base font-medium" htmlFor="product-description">
          Product Description
        </label>
        <textarea
          id="product-description"
          rows={4}
          className={`${fieldClass} resize-none`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1 max-w-md">
        <label className="text-base font-medium" htmlFor="additional-info">
          Material and Build Quality
        </label>
        <textarea
          id="additional-info"
          rows={4}
          className={`${fieldClass} resize-none`}
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1 max-w-md">
        <label className="text-base font-medium" htmlFor="ideal-for">
          Add Product Ideal Cases
        </label>
        <textarea
          id="ideal-for"
          rows={4}
          className={`${fieldClass} resize-none`}
          value={idealFor}
          onChange={(e) => setIdealFor(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1 max-w-md">
        <label className="text-base font-medium" htmlFor="key-features">
          Add Product Key Features
        </label>
        <textarea
          id="key-features"
          rows={4}
          className={`${fieldClass} resize-none`}
          value={keyFeatures}
          onChange={(e) => setKeyFeatures(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1 max-w-md">
        <label className="text-base font-medium" htmlFor="product-compatibility">
          Add Product Compatibility Details
        </label>
        <textarea
          id="product-compatibility"
          rows={4}
          className={`${fieldClass} resize-none`}
          value={compatibility}
          onChange={(e) => setCompatibility(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1 max-w-md">
        <label
          className="text-base font-medium"
          htmlFor="technical-specifications"
        >
          Add Product&apos;s Technical Specifications
        </label>
        <textarea
          id="technical-specifications"
          rows={4}
          className={`${fieldClass} resize-none`}
          value={technicalSpecifications}
          onChange={(e) => setTechnicalSpecifications(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1 max-w-md">
        <label className="text-base font-medium" htmlFor="box-includes">
          What&apos;s included in the box?
        </label>
        <textarea
          id="box-includes"
          rows={4}
          className={`${fieldClass} resize-none`}
          value={boxIncludes}
          onChange={(e) => setBoxIncludes(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1 max-w-md">
        <label className="text-base font-medium" htmlFor="care-instructions">
          Add Product Care Instructions
        </label>
        <textarea
          id="care-instructions"
          rows={4}
          className={`${fieldClass} resize-none`}
          value={careInstructions}
          onChange={(e) => setCareInstructions(e.target.value)}
        />
      </div>

      {["faq1", "faq2", "faq3", "faq4"].map((faqKey, idx) => {
        const setters = [setFaq1, setFaq2, setFaq3, setFaq4];
        const values = [faq1, faq2, faq3, faq4];
        return (
          <div key={faqKey} className="flex flex-col gap-1 max-w-md">
            <label className="text-base font-medium" htmlFor={faqKey}>
              FAQ {idx + 1}
            </label>
            <textarea
              id={faqKey}
              rows={4}
              className={`${fieldClass} resize-none`}
              value={values[idx]}
              onChange={(e) => setters[idx](e.target.value)}
              placeholder="Question|Answer"
            />
          </div>
        );
      })}

      <div className="flex items-center gap-5 flex-wrap">
        <div className="flex flex-col gap-1 w-32">
          <label className="text-base font-medium" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className={fieldClass}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {!SHOP_CATEGORIES.some((c) => c.name === category) && category && (
              <option value={category}>{category}</option>
            )}
            {SHOP_CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.name}>
                {cat.navLabel}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 w-32">
          <label className="text-base font-medium" htmlFor="material-type">
            Material Type
          </label>
          <select
            id="material-type"
            className={fieldClass}
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value)}
          >
            {MATERIAL_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m === "PLA+" ? "PLA +" : m}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 w-32">
          <label className="text-base font-medium" htmlFor="product-price">
            Product Price
          </label>
          <input
            id="product-price"
            type="number"
            className={fieldClass}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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
            className={fieldClass}
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
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
            className={fieldClass}
            value={length}
            onChange={(e) => setLength(e.target.value)}
            required={!isEdit}
          />
        </div>
        <div className="flex flex-col gap-1 w-32">
          <label className="text-base font-medium" htmlFor="height">
            Height (cm)
          </label>
          <input
            id="height"
            type="number"
            className={fieldClass}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required={!isEdit}
          />
        </div>
        <div className="flex flex-col gap-1 w-32">
          <label className="text-base font-medium" htmlFor="depth">
            Depth (cm)
          </label>
          <input
            id="depth"
            type="number"
            className={fieldClass}
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
            required={!isEdit}
          />
        </div>
        <div className="flex flex-col gap-1 w-32">
          <label className="text-base font-medium" htmlFor="weight">
            Weight (gms)
          </label>
          <input
            id="weight"
            type="number"
            className={fieldClass}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required={!isEdit}
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
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setSelectedColorImages((prev) => ({
                        ...prev,
                        [item]: file || existingColorImages[item] || null,
                      }));
                    }}
                  />
                  {getColorPreview(item) && (
                    <img
                      src={getColorPreview(item)}
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
            Selected: {Object.keys(selectedColorImages).join(", ")}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded"
      >
        {submitLabel}
      </button>
    </form>
  );
}
