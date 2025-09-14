'use client';

import { useState } from 'react';

export default function OrderTrackingCard({ orderData }) {
    const [activeTab, setActiveTab] = useState('status');

    const getStatusColor = (status) => {
        const statusColors = {
            'PENDING': 'bg-yellow-100 text-yellow-800',
            'CONFIRMED': 'bg-blue-100 text-blue-800',
            'PROCESSING': 'bg-purple-100 text-purple-800',
            'SHIPPED': 'bg-indigo-100 text-indigo-800',
            'IN_TRANSIT': 'bg-blue-100 text-blue-800',
            'OUT_FOR_DELIVERY': 'bg-orange-100 text-orange-800',
            'DELIVERED': 'bg-green-100 text-green-800',
            'CANCELLED': 'bg-red-100 text-red-800',
            'NEW': 'bg-green-100 text-green-800',
            'CANCELED': 'bg-red-100 text-red-800'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        const statusTexts = {
            'PENDING': 'Order Pending',
            'CONFIRMED': 'Order Confirmed',
            'PROCESSING': 'Processing',
            'SHIPPED': 'Shipped',
            'IN_TRANSIT': 'In Transit',
            'OUT_FOR_DELIVERY': 'Out for Delivery',
            'DELIVERED': 'Delivered',
            'CANCELLED': 'Cancelled',
            'NEW': 'New Order',
            'CANCELED': 'Cancelled'
        };
        return statusTexts[status] || status;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Order #{orderData.customOrderId}</h2>
                        <p className="text-blue-100">Placed on {formatDate(orderData.orderDate)}</p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                        <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(orderData.shipment.status)}`}>
                            {getStatusText(orderData.shipment.status)}
                        </div>
                        <p className="text-blue-100 mt-2 text-lg font-semibold">
                            {formatPrice(orderData.totalAmount)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                    {[
                        { id: 'status', label: 'Status', icon: '📦' },
                        { id: 'details', label: 'Order Details', icon: '📋' },
                        { id: 'tracking', label: 'Tracking', icon: '🚚' },
                        { id: 'items', label: 'Items', icon: '🛍️' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {/* Status Tab */}
                {activeTab === 'status' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-2">Order Status</h3>
                                <p className="text-gray-600">{getStatusText(orderData.status)}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-2">Payment Method</h3>
                                <p className="text-gray-600">{orderData.paymentMethod}</p>
                            </div>
                        </div>

                        {orderData.shipment.trackingUrl && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-semibold text-blue-900 mb-2">Track Your Package</h3>
                                <a
                                    href={orderData.shipment.trackingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    Open Tracking Link
                                </a>
                            </div>
                        )}
                    </div>
                )}

                {/* Order Details Tab */}
                {activeTab === 'details' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    <p><span className="font-medium">Name:</span> {orderData.customer.name}</p>
                                    <p><span className="font-medium">Email:</span> {orderData.customer.email}</p>
                                    <p><span className="font-medium">Phone:</span> {orderData.customer.phone}</p>
                                </div>
                            </div>
                            
                            {orderData.address && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Delivery Address</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                        <p><span className="font-medium">Name:</span> {orderData.address.name}</p>
                                        <p><span className="font-medium">Address:</span> {orderData.address.address}</p>
                                        <p><span className="font-medium">City:</span> {orderData.address.city}</p>
                                        <p><span className="font-medium">State:</span> {orderData.address.state}</p>
                                        <p><span className="font-medium">Pincode:</span> {orderData.address.pincode}</p>
                                        <p><span className="font-medium">Phone:</span> {orderData.address.phone}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tracking Tab */}
                {activeTab === 'tracking' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-2">Shipment Information</h3>
                                <div className="space-y-2">
                                    <p><span className="font-medium">Status:</span> {getStatusText(orderData.shipment.status)}</p>
                                    {orderData.shipment.awb && (
                                        <p><span className="font-medium">AWB:</span> {orderData.shipment.awb}</p>
                                    )}
                                    {orderData.shipment.courierName && (
                                        <p><span className="font-medium">Courier:</span> {orderData.shipment.courierName}</p>
                                    )}
                                    {orderData.shipment.pickupScheduledDate && (
                                        <p><span className="font-medium">Pickup Date:</span> {formatDate(orderData.shipment.pickupScheduledDate)}</p>
                                    )}
                                    {orderData.shipment.expectedDeliveryDate && (
                                        <p><span className="font-medium">Expected Delivery:</span> {formatDate(orderData.shipment.expectedDeliveryDate)}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Real-time Tracking */}
                        {orderData.realTimeTracking && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h3 className="font-semibold text-green-900 mb-3">Real-time Tracking</h3>
                                <p className="text-green-800 mb-2">
                                    <span className="font-medium">Current Status:</span> {orderData.realTimeTracking.currentStatus}
                                </p>
                                {orderData.realTimeTracking.lastUpdate && (
                                    <p className="text-green-700 text-sm">
                                        Last Update: {formatDate(orderData.realTimeTracking.lastUpdate.date)}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Items Tab */}
                {activeTab === 'items' && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                        <div className="space-y-4">
                            {orderData.items.map((item, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                                            <p className="text-gray-600">Quantity: {item.quantity}</p>
                                            <p className="text-gray-600">Price: {formatPrice(item.price)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="border-t pt-4">
                            <div className="flex justify-end">
                                <div className="text-right">
                                    <p className="text-xl font-bold text-gray-900">
                                        Total: {formatPrice(orderData.totalAmount)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
