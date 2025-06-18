'use client'
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";

const DesignRequests = () => {
  const { getToken } = useAppContext();
  const [designRequests, setDesignRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDesignRequests = async () => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const { data } = await axios.get('/api/design-request/list', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setDesignRequests(data.designRequests);
      } else {
        toast.error(data.message || "Failed to fetch design requests");
      }
    } catch (error) {
      console.error("Error fetching design requests:", error);
      toast.error(error.message || "Error fetching design requests");
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const { data } = await axios.put(`/api/design-request/${requestId}/status`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success(`Status updated to ${newStatus}`);
        fetchDesignRequests(); // Refresh the list
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.message || "Error updating status");
    }
  };

  const downloadFile = async (requestId, fileName) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      // Open the download URL in a new tab/window
      // This will trigger the download from Cloudinary
      const downloadUrl = `/api/design-request/${requestId}/download`;
      window.open(downloadUrl, '_blank');

      toast.success("Download started");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Error downloading file");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REVIEWING':
        return 'bg-blue-100 text-blue-800';
      case 'QUOTED':
        return 'bg-purple-100 text-purple-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-orange-100 text-orange-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchDesignRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-orange-500 border-gray-200"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">3D Design Requests</h1>
          <p className="text-gray-600 mt-2">Manage and review customer design requests</p>
        </div>

        {designRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Design Requests</h3>
            <p className="text-gray-500">There are no design requests to review at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {designRequests.map((request) => (
              <div key={request._id} className="bg-white rounded-lg shadow-md p-6 border">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {request.designName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Requested by: {request.userId}
                        </p>
                        <p className="text-sm text-gray-500">
                          Date: {new Date(request.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Design Details</h4>
                        <p className="text-gray-600 text-sm mb-2">{request.description}</p>
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Material:</span> {request.material}</p>
                          <p><span className="font-medium">Color:</span> {request.color || 'Not specified'}</p>
                          <p><span className="font-medium">Quantity:</span> {request.quantity}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">File Information</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">File:</span> {request.fileName}</p>
                          <button
                            onClick={() => downloadFile(request._id, request.fileName)}
                            className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition"
                          >
                            📥 Download File
                          </button>
                          {request.specialRequirements && (
                            <p><span className="font-medium">Special Requirements:</span> {request.specialRequirements}</p>
                          )}
                          {request.quote && (
                            <p><span className="font-medium">Quote:</span> ₹{request.quote}</p>
                          )}
                          {request.estimatedDelivery && (
                            <p><span className="font-medium">Estimated Delivery:</span> {new Date(request.estimatedDelivery).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {request.adminNotes && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Admin Notes</h4>
                        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">{request.adminNotes}</p>
                      </div>
                    )}
                  </div>

                  <div className="lg:w-48">
                    <h4 className="font-medium text-gray-900 mb-3">Update Status</h4>
                    <select
                      value={request.status}
                      onChange={(e) => updateRequestStatus(request._id, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="REVIEWING">Reviewing</option>
                      <option value="QUOTED">Quoted</option>
                      <option value="APPROVED">Approved</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignRequests; 