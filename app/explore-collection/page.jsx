"use client";
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";
import axios from "axios";

const ExploreCollection = () => {
  const { user, getToken } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    designName: "",
    description: "",
    material: "PLA",
    color: "Pitch black",
    quantity: 1,
    specialRequirements: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const allowedTypes = ['.stl', '.3mf', '.gcode'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!allowedTypes.includes(fileExtension)) {
        toast.error("Please upload a valid 3D design file (.stl, .3mf, or .gcode)");
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        return;
      }
      
      setSelectedFile(file);
      toast.success("File uploaded successfully!");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to submit a design request");
      return;
    }

    if (!selectedFile) {
      toast.error("Please upload a design file");
      return;
    }

    if (!formData.designName.trim()) {
      toast.error("Please enter a design name");
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('file', selectedFile);
      submitData.append('designName', formData.designName);
      submitData.append('description', formData.description);
      submitData.append('material', formData.material);
      submitData.append('color', formData.color);
      submitData.append('quantity', formData.quantity);
      submitData.append('specialRequirements', formData.specialRequirements);

      const response = await axios.post('/api/design-request/create', submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data.success) {
        toast.success("Design request submitted successfully!");
        // Reset form
        setFormData({
          designName: "",
          description: "",
          material: "PLA",
          color: "Pitch black",
          quantity: 1,
          specialRequirements: "",
        });
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('file-upload');
        if (fileInput) fileInput.value = '';
      } else {
        toast.error(response.data.message || "Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting design request:", error);
      toast.error(error.response?.data?.message || "Error submitting request");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">Please login to access our custom design services.</p>
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen px-6 md:px-16 lg:px-32 pt-14 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">
              Custom 3D Design Service
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload your design file and let us bring your ideas to life with our premium 3D printing service
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Upload Section */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Upload Your Design</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Design File *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition">
                      <input
                        id="file-upload"
                        type="file"
                        accept=".stl,.3mf,.gcode"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Image
                          src={assets.upload_area}
                          alt="upload"
                          className="mx-auto mb-4 w-16 h-16 opacity-50"
                        />
                        <p className="text-sm text-gray-600">
                          {selectedFile ? selectedFile.name : "Click to upload your 3D design file"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Supported formats: .stl, .3mf, .gcode (Max 10MB)
                        </p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Design Name *
                    </label>
                    <input
                      type="text"
                      name="designName"
                      value={formData.designName}
                      onChange={handleInputChange}
                      placeholder="Enter your design name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your design and any specific requirements"
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Print Specifications</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Material
                    </label>
                    <select
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="PLA">PLA (Standard)</option>
                      <option value="ABS">ABS (Durable)</option>
                      <option value="PETG">PETG (Strong & Flexible)</option>
                      <option value="TPU">TPU (Flexible)</option>
                      <option value="Resin">Resin (High Detail)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color Preference
                    </label>
                    <select
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {availableColors.map((color) => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      min="1"
                      max="100"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requirements
                    </label>
                    <textarea
                      name="specialRequirements"
                      value={formData.specialRequirements}
                      onChange={handleInputChange}
                      placeholder="Any special requirements, infill percentage, layer height, etc."
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">What happens next?</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• We'll review your design file and specifications</li>
                  <li>• You'll receive a quote within 24-48 hours</li>
                  <li>• Once approved, we'll start printing your design</li>
                  <li>• Quality check and shipping to your address</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-12 py-4 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Design Request"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ExploreCollection;