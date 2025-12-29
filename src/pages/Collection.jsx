import React, { useEffect, useState } from 'react';
import ProductCard from '../component/ProductCard';
import { useShop } from '../context/ShopContext';

const Collection = () => {
  const { fetchProducts, getFilteredProducts, categories, selectedCategory, setSelectedCategory } = useShop();
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState(500);

  useEffect(() => {
    fetchProducts();
  }, []);

  let products = getFilteredProducts();

  // Apply sorting
  if (sortBy === 'price-low-high') {
    products = [...products].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high-low') {
    products = [...products].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name') {
    products = [...products].sort((a, b) => a.name.localeCompare(b.name));
  }


  products = products.filter(product => product.price <= priceRange);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Our Collection</h1>
        
    
        <div className="mb-12 p-6 bg-gray-50 rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Category Filter */}
            <div className="flex space-x-2 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 border'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

        
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded-md"
              >
                <option value="default">Default Sorting</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

         
        </div>

      
        {products.length > 0 ? (
          <>
            <p className="text-gray-600 mb-6">
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters or browse all categories.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;