"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";

const OrderDetails = () => {
  const { orderId } = useParams();
  const router = useRouter();
  const { currency, getToken, user } = useAppContext();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingInvoice, setSendingInvoice] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`/api/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setOrder(response.data.order);
        setLoading(false);
      } else {
        toast.error(response.data.message);
        router.push('/seller/orders');
      }
    } catch (error) {
      toast.error(error.message);
      router.push('/seller/orders');
    }
  };

  const sendGSTInvoice = async () => {
    try {
      setSendingInvoice(true);
      const token = await getToken();
      
      const response = await axios.post(`/api/order/${orderId}/send-invoice`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        toast.success("GST Invoice sent successfully!");
      } else {
        toast.error(response.data.message || "Failed to send GST Invoice");
      }
      
    } catch (error) {
      toast.error("Failed to send GST Invoice");
    } finally {
      setSendingInvoice(false);
    }
  };

  useEffect(() => {
    if (user && orderId) {
      fetchOrderDetails();
    }
  }, [user, orderId]);

  if (loading) {
    return <Loading />;
  }

  if (!order) {
    return (
      <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
        <div className="md:p-10 p-4">
          <p className="text-center text-gray-500">Order not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      <div className="md:p-10 p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold">Order Details</h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={sendGSTInvoice}
              disabled={sendingInvoice}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {sendingInvoice ? "Sending..." : "Send GST Invoice"}
            </button>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Order Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Order ID:</span> {order.customOrderId || order._id}</p>
                <p><span className="font-medium">Date:</span> {new Date(order.date).toLocaleDateString()}</p>
                <p><span className="font-medium">Status:</span> <span className="text-green-600 font-medium">{order.status}</span></p>
                <p><span className="font-medium">Payment Method:</span> {order.paymentMethod}</p>
                <p><span className="font-medium">Payment Status:</span> <span className={`font-medium ${order.paymentStatus === 'COMPLETED' ? 'text-green-600' : 'text-orange-600'}`}>{order.paymentStatus}</span></p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Subtotal:</span> {currency}{order.subtotal || Math.round(order.amount / 1.18)}</p>
                <p><span className="font-medium">GST (18%):</span> {currency}{order.gst || Math.round(order.amount - (order.amount / 1.18))}</p>
                <p><span className="font-medium">Delivery Charges:</span> {currency}{order.deliveryCharges || 0}</p>
                {order.discount > 0 && (
                  <p><span className="font-medium">Discount:</span> -{currency}{order.discount}</p>
                )}
                <p className="text-lg font-semibold border-t pt-2">
                  <span className="font-medium">Total:</span> {currency}{order.amount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p><span className="font-medium">Name:</span> {order.address?.fullName || 'N/A'}</p>
              <p><span className="font-medium">Phone:</span> {order.address?.phoneNumber || 'N/A'}</p>
              <p><span className="font-medium">Email:</span> {order.userEmail || 'N/A'}</p>
            </div>
            <div>
              <p><span className="font-medium">Address:</span></p>
              <p className="text-gray-600">
                {order.address?.area || 'N/A'}, {order.address?.city || 'N/A'}, {order.address?.state || 'N/A'} - {order.address?.pincode || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                <Image
                  src={item.product?.image || assets.box_icon}
                  alt={item.product?.name || 'Product'}
                  width={64}
                  height={64}
                  className="object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.product?.name || 'Product Name Unavailable'}</h4>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  {item.color && <p className="text-gray-600">Color: {item.color}</p>}
                  <p className="text-gray-600">Price: {currency}{item.product?.offerPrice || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{currency}{(item.product?.offerPrice || 0) * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Order Data */}
        {order.data && Object.keys(order.data).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(order.data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetails;
