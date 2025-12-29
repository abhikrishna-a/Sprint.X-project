import React, { useEffect } from 'react';
import Hero from '../component/Hero';
import OurPolicy from '../component/OurPolicy';
import Newsletter from '../component/Newsletter';
import ProductCard from '../component/ProductCard';
import { useShop } from '../context/ShopContext';

const Home = () => {
  const { fetchProducts, getFilteredProducts } = useShop();

  useEffect(() => {
    fetchProducts();
  }, []);

  const products = getFilteredProducts();

  return (
    <div>
      <Hero />
      
  
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading products...</p>
            </div>
          )}
        </div>
      </section>

      <OurPolicy />
      <Newsletter />
    </div>
  );
};

export default Home;