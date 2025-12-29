import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useShop();

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
       
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded mb-2">
                {product.category}
              </span>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-gray-700">
                {product.name}
              </h3>
            </div>
            <span className="text-xl font-bold">${product.price}</span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description || 'Premium quality product designed for comfort and style.'}
          </p>


          <button
            onClick={handleAddToCart}
            className="w-full border border-black text-black py-2 rounded-md font-medium hover:bg-black hover:text-white transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;