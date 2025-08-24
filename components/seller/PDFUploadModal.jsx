import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';

const PDFUploadModal = ({ isOpen, onClose, onSend, order, loading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const { currency } = useAppContext();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      
      // Check file size (max 1MB for EmailJS compatibility)
      if (file.size > 1 * 1024 * 1024) {
        toast.error('File size should be less than 1MB for email compatibility');
        return;
      }
      
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleSend = () => {
    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }
    
    onSend(selectedFile);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setFileName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Send GST Invoice</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-800 mb-2">Order Summary</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Order ID:</span> {order?.customOrderId || order?._id}</p>
            <p><span className="font-medium">Customer:</span> {order?.userName || order?.address?.fullName}</p>
            <p><span className="font-medium">Email:</span> {order?.userEmail}</p>
            <p><span className="font-medium">Total:</span> {currency}{order?.amount}</p>
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload GST Invoice PDF
          </label>
          <div className="mb-2">
            <p className="text-xs text-gray-500 mb-2">
              <strong>Important:</strong> For EmailJS compatibility, PDF files must be under 1MB. 
              Larger files will be sent without attachment.
            </p>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer text-blue-600 hover:text-blue-700"
            >
              {selectedFile ? (
                <div>
                  <svg className="mx-auto h-8 w-8 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium text-green-600">{fileName}</p>
                  <p className="text-xs text-gray-500">Click to change file</p>
                </div>
              ) : (
                <div>
                  <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm font-medium text-blue-600">Click to upload PDF</p>
                  <p className="text-xs text-gray-500">PDF files only, max 1MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!selectedFile || loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Invoice'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFUploadModal;
