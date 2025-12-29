import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, products, fetchProducts } = useShop();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    if (products.length > 0 && id) {
      const foundProduct = products.find(p => p.id.toString() === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setLoading(false);
      } else {
        setError('Product not found');
        setLoading(false);
      }
    } else if (products.length === 0 && id) {

      fetchProducts();
    }
  }, [id, products]);

  useEffect(() => {
    if (products.length > 0 && id && !product) {
      const foundProduct = products.find(p => p.id.toString() === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setLoading(false);
      } else {
        setError('Product not found');
        setLoading(false);
      }
    }
  }, [products, id, product]);

  const handleAddToCart = () => {
    if (!product) return;
    

    addToCart({
      ...product,
      quantity: quantity
    });
    
    navigate('/cart');
  };

  const handleBuyNow = () => {
    if (!product) return;
    

    addToCart({
      ...product,
      quantity: quantity
    });
    

    navigate('/placeorder');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }


  const images = product.images 
    ? Array.isArray(product.images) 
      ? product.images 
      : [product.images]
    : product.image 
      ? [product.image]
      : ['https://via.placeholder.com/600'];


  const price = parseFloat(product.price) || 0;
  const totalPrice = (price * quantity).toFixed(2);

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-black mb-8 hover:underline"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
              <img
                src={images[selectedImage]}
                alt={product.name || 'Product Image'}
                className="w-full h-96 object-contain rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600';
                }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                      selectedImage === index ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name || 'Product'} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/100';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>


          <div>
            <div className="mb-6">
              {product.category && (
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium mb-4">
                  {product.category}
                </span>
              )}
              <h1 className="text-3xl font-bold mb-4">{product.name || 'Unnamed Product'}</h1>
              <p className="text-2xl font-bold mb-6">${price.toFixed(2)}</p>
              {product.description && (
                <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>
              )}
            </div>

     
            {(product.rating || product.reviewCount) && (
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < (product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    {product.reviewCount && (
                      <span className="ml-2 text-gray-600">({product.reviewCount} reviews)</span>
                    )}
                  </div>
                  <span className="text-green-600 font-medium">In Stock</span>
                </div>
              </div>
            )}

               <div className="mb-8">
                <label className="block text-sm font-medium mb-2">Quantity</label>

                <div className="flex items-center border rounded-lg overflow-hidden w-36">
 
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-12 h-10 flex items-center justify-center border-r text-lg hover:bg-gray-100 disabled:opacity-40"
                  >
                    -
                  </button>

       
                  <div className="w-12 h-10 flex items-center justify-center text-lg">
                    {quantity}
                  </div>

          
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-10 flex items-center justify-center border-l text-lg hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

 
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-4 rounded-md font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!product}
              >
                Add to Cart - ${totalPrice}
              </button>
              
              <button
                onClick={handleBuyNow}
                className="w-full border-2 border-black text-black py-4 rounded-md font-semibold hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!product}
              >
                Buy Now
              </button>
            </div>


            <div className="mt-12 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Product Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Material</p>
                  <p className="font-medium">{product.material || 'Premium Quality'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Color</p>
                  <p className="font-medium">{product.color || 'Various'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Size</p>
                  <p className="font-medium">{product.size || 'One Size'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Warranty</p>
                  <p className="font-medium">{product.warranty || '1 Year'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;