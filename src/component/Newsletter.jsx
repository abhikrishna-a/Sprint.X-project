import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
    
      console.log('Subscribed email:', email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter for exclusive deals, new arrivals, and style tips. 
          No spam, just the good stuff.
        </p>
        
        {subscribed ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-green-700 font-medium">
              Thank you for subscribing! Check your email for confirmation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-black"
                required
              />
              <button
                type="submit"
                className="bg-black text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              By subscribing, you agree to our Privacy Policy
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Newsletter;