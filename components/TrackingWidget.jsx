'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TrackingWidget({ className = '' }) {
    const [trackingId, setTrackingId] = useState('');
    const router = useRouter();

    const handleTrack = (e) => {
        e.preventDefault();
        if (trackingId.trim()) {
            router.push(`/track-order?trackingId=${encodeURIComponent(trackingId.trim())}`);
        }
    };

    return (
        <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Track Your Order</h3>
            <form onSubmit={handleTrack} className="space-y-3">
                <div>
                    <input
                        type="text"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        placeholder="Enter order ID or tracking number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!trackingId.trim()}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                    Track Order
                </button>
            </form>
        </div>
    );
}
