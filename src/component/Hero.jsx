import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-gray-900/90 to-black/90 text-white overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: 'url(https://wallpaperbat.com/img/520696-get-run-wallpaper-image-oi-dont-forget-drop-follow-and-pin-iphone-androi-in-2020-running-picture-outfits-for-teens-for-school-wallpaper.jpg)',
        }}
      />
      
     
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 z-1"></div>
      
      <div className="container relative mx-auto px-4 py-16 md:py-24 z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Elevate Your Style Game
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Discover premium fashion that combines comfort, style, and quality. 
            From sneakers to smart wearables, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/collection"
              className="bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-gray-200 transition-colors text-center"
            >
              Shop Now
            </Link>
            <Link
              to="/about"
              className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-black transition-colors text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;