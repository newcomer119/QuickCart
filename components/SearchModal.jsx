import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { assets } from '@/assets/assets';

const SearchModal = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef(null);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setIsDropdownOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/product/search?query=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSearchResults(data.products || []);
        setIsDropdownOpen(true);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProductClick = (productId) => {
    router.push(`/product/${productId}`);
    setSearchQuery('');
    setSearchResults([]);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative flex-grow max-w-lg w-full" ref={searchRef}>
      <div className="flex items-center border border-gray-300 rounded-lg pr-1 bg-white shadow-sm h-12">
        <input
          type="text"
          placeholder="Search For Your Wish!!"
          className="w-full outline-none text-base text-gray-700 placeholder-gray-400 pl-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.trim().length >= 2 && setIsDropdownOpen(true)}
        />
        <button className="p-2 rounded-lg bg-gray-100 h-full flex items-center justify-center">
          <Image src={assets.search_icon} alt="search" className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {isDropdownOpen && searchQuery.trim().length >= 2 && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto z-10">
          {isLoading ? (
            <div className="p-3 text-center text-gray-500 text-sm">Searching...</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {searchResults.map((product) => (
                <div
                  key={product._id}
                  className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                  onClick={() => handleProductClick(product._id)}
                >
                  {product.image && product.image[0] && (
                    <Image
                      src={product.image[0]}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-sm text-gray-800">{product.name}</h3>
                    <p className="text-xs text-gray-600">₹{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {isDropdownOpen && searchQuery.trim().length >= 2 && searchResults.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto z-10 p-3 text-center text-gray-500 text-sm">
          No products found
        </div>
      )}
    </div>
  );
};

export default SearchModal; 