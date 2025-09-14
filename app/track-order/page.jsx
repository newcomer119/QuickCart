'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from '@/components/Loading';
import OrderTrackingCard from '@/components/OrderTrackingCard';

function TrackOrderContent() {
    const [trackingId, setTrackingId] = useState('');
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();

    // Auto-track if trackingId is provided in URL
    useEffect(() => {
        const urlTrackingId = searchParams.get('trackingId');
        if (urlTrackingId) {
            setTrackingId(urlTrackingId);
            handleTrackOrder(null, urlTrackingId);
        }
    }, [searchParams]);

    const handleTrackOrder = async (e, trackingIdParam = null) => {
        if (e) e.preventDefault();
        
        const idToTrack = trackingIdParam || trackingId;
        
        if (!idToTrack.trim()) {
            setError('Please enter a tracking ID');
            return;
        }

        setLoading(true);
        setError('');
        setOrderData(null);

        try {
            const response = await fetch(`/api/order/track?trackingId=${encodeURIComponent(idToTrack.trim())}`);
            const result = await response.json();

            if (result.success) {
                setOrderData(result.data);
            } else {
                setError(result.message || 'Order not found');
            }
        } catch (error) {
            console.error('Error tracking order:', error);
            setError('Failed to track order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleNewSearch = () => {
        setOrderData(null);
        setTrackingId('');
        setError('');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
                    <p className="text-gray-600">Enter your order ID or tracking number to check the status</p>
                </div>

                {/* Search Form */}
                {!orderData && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <form onSubmit={handleTrackOrder} className="space-y-4">
                            <div>
                                <label htmlFor="trackingId" className="block text-sm font-medium text-gray-700 mb-2">
                                    Order ID or Tracking Number
                                </label>
                                <input
                                    type="text"
                                    id="trackingId"
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value)}
                                    placeholder="Enter your order ID or tracking number"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={loading}
                                />
                            </div>
                            
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}
                            
                            <button
                                type="submit"
                                disabled={loading || !trackingId.trim()}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Tracking...' : 'Track Order'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <Loading />
                    </div>
                )}

                {/* Order Tracking Results */}
                {orderData && (
                    <div className="space-y-6">
                        {/* Back to Search Button */}
                        <button
                            onClick={handleNewSearch}
                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Track Another Order</span>
                        </button>

                        {/* Order Tracking Card */}
                        <OrderTrackingCard orderData={orderData} />
                    </div>
                )}

                {/* Help Section */}
                <div className="mt-12 bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Need Help?</h3>
                    <div className="text-blue-800 space-y-2">
                        <p>• Your tracking number can be found in your order confirmation email</p>
                        <p>• You can also use your order ID from the website</p>
                        <p>• For additional support, please contact our customer service</p>
                    </div>
                    <button
                        onClick={() => router.push('/contact')}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function TrackOrderPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loading />
            </div>
        }>
            <TrackOrderContent />
        </Suspense>
    );
}
