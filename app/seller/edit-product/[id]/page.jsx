'use client'
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/Loading";

const EditProduct = () => {
    const { id } = useParams();
    const router = useRouter();
    const { getToken, setIsLoading, isLoading } = useAppContext();

    const [productData, setProductData] = useState(null);
    const [files, setFiles] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [category, setCategory] = useState('');
    const [selectedColorImages, setSelectedColorImages] = useState({});
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [existingImages, setExistingImages] = useState([]);
    const [existingColorImages, setExistingColorImages] = useState({});

    const availableColors = [
        'Pitch black', 'Pure white', 'Lemon yellow', 'Mauve purple', 'Nuclear red', 'Outrageous orange',
        'Atomic pink', 'Royal blue', 'Light grey', 'Light blue', 'Grass green', 'Beige brown',
        'Teal blue', 'Army green', 'Dark grey', 'Ivory white', 'Rust copper', 'Appricot',
        'Lagoon blue', 'Forest green', 'Fluorescent orange', 'Fluorescent green', 'Transparent',
        'Bhama yellow', 'Chocolate brown', 'Fluorescent yellow', 'Levender violet', 'Magenta',
        'Military khaki', 'Ryobix green', 'Simply silver', 'Midnight grey', 'Thanos purple',
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

    useEffect(() => {
        const fetchProductData = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const token = await getToken();
                const { data } = await axios.get(`/api/product/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (data.success) {
                    const product = data.product;
                    setProductData(product);
                    setName(product.name);
                    setDescription(product.description);
                    setAdditionalInfo(product.additionalInfo || '');
                    setCategory(product.category);
                    setPrice(product.price);
                    setOfferPrice(product.offerPrice);
                    setExistingImages(product.image || []);
                    setExistingColorImages(product.colorImages || {});
                    
                    const colorImages = {};
                    product.colors.forEach(color => {
                        colorImages[color] = product.colorImages[color] || null;
                    });
                    setSelectedColorImages(colorImages);

                } else {
                    toast.error(data.message);
                    router.push('/seller/product-list');
                }
            } catch (error) {
                toast.error("Failed to fetch product data.");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductData();
    }, [id, getToken, setIsLoading, router]);

    const handleColorChange = (color) => {
        setSelectedColorImages(prev => {
            const updated = { ...prev };
            if (updated.hasOwnProperty(color)) {
                delete updated[color];
            } else {
                updated[color] = existingColorImages[color] || null;
            }
            return updated;
        });
    };
    
    const handleImageChange = (e, index) => {
        if (e.target.files[0]) {
            const updatedFiles = [...files];
            updatedFiles[index] = e.target.files[0];
            setFiles(updatedFiles);
        }
    };

    const handleColorImageChange = (e, color) => {
        if (e.target.files[0]) {
            setSelectedColorImages(prev => ({
                ...prev,
                [color]: e.target.files[0]
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('additionalInfo', additionalInfo);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('offerPrice', offerPrice);
        formData.append('colors', JSON.stringify(Object.keys(selectedColorImages)));
        
        // Append new product images
        files.forEach((file) => {
            if (file) {
                formData.append('images', file);
            }
        });

        // Append new color images
        Object.entries(selectedColorImages).forEach(([color, file]) => {
            if (file instanceof File) {
                formData.append(`colorImages[${color}]`, file);
            }
        });

        try {
            const token = await getToken();
            const { data } = await axios.put(`/api/product/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (data.success) {
                toast.success("Product updated successfully!");
                router.push('/seller/product-list');
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
    
    if (isLoading || !productData) {
        return <Loading />;
    }

    return (
        <div className="flex-1 min-h-screen flex flex-col justify-between">
            <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
                <h1 className="text-2xl font-semibold">Edit Product</h1>
                
                <div>
                    <p className="text-base font-medium">Product Images</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {[...Array(4)].map((_, index) => (
                            <div key={index}>
                                <label htmlFor={`image${index}`}>
                                    <input 
                                        onChange={(e) => handleImageChange(e, index)} 
                                        type="file" 
                                        id={`image${index}`} 
                                        accept="image/*"
                                        hidden 
                                    />
                                    <Image
                                        className="max-w-24 cursor-pointer"
                                        src={files[index] ? URL.createObjectURL(files[index]) : (existingImages[index] || assets.upload_area)}
                                        alt="Product image"
                                        width={100}
                                        height={100}
                                    />
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                    <input id="product-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                </div>

                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                    <textarea id="product-description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" required></textarea>
                </div>
                
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="additional-info">Additional Product Info</label>
                    <textarea id="additional-info" rows={4} value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"></textarea>
                </div>
                
                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="category">Category</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40">
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
                        <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                        <input id="product-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                    <div className="flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                        <input id="offer-price" type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                </div>

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
                                        checked={selectedColorImages.hasOwnProperty(item)}
                                        onChange={() => handleColorChange(item)}
                                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                    />
                                    <span className="text-sm">{item}</span>
                                </label>
                                {selectedColorImages.hasOwnProperty(item) && (
                                    <div className="mt-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => handleColorImageChange(e, item)}
                                        />
                                        {(selectedColorImages[item] || existingColorImages[item]) && (
                                            <img
                                                src={
                                                    selectedColorImages[item] instanceof File
                                                        ? URL.createObjectURL(selectedColorImages[item])
                                                        : existingColorImages[item]
                                                }
                                                alt={`${item} preview`}
                                                className="w-16 h-16 object-cover mt-1"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded">
                    Update Product
                </button>
            </form>
        </div>
    );
};

export default EditProduct; 