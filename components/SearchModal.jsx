import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { assets } from '@/assets/assets';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/product/search?query=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSearchResults(data.products || []);
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleProductClick = (productId) => {
    router.push(`/product/${productId}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white w-full max-w-2xl mx-4 rounded-lg shadow-lg">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Image src={assets.search_icon} alt="search" className="w-5 h-5" />
            <input
              type="text"
              placeholder="Search for 3D printers, filaments, or accessories..."
              className="w-full outline-none text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : searchResults.length > 0 ? (
            <div className="divide-y">
              {searchResults.map((product) => (
                <div
                  key={product._id}
                  className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4"
                  onClick={() => handleProductClick(product._id)}
                >
                  {product.images && product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">₹{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery.trim().length >= 2 ? (
            <div className="p-4 text-center text-gray-500">No products found</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchModal; 