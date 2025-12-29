import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen">
  
      <div className="bg-gradient-to-r from-gray-900 to-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About SPRINT.X</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Redefining fashion with premium quality, sustainable practices, 
            and exceptional customer experiences since 2020.
          </p>
        </div>
      </div>


      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-gray-600 mb-4">
                  Founded in 2020, SPRINT.X began as a small passion project with a simple 
                  mission: to make premium fashion accessible to everyone. We believed that 
                  everyone deserves to wear quality products that make them feel confident 
                  and comfortable.
                </p>
                <p className="text-gray-600 mb-4">
                  What started as a small online store has grown into a beloved brand 
                  trusted by thousands of customers worldwide. Our journey has been fueled 
                  by our commitment to quality, sustainability, and customer satisfaction.
                </p>
                <p className="text-gray-600">
                  Today, we continue to innovate and expand our collection while staying 
                  true to our core values of transparency, quality, and exceptional service.
                </p>
              </div>
              <div className="bg-gray-100 rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-6">Our Values</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="font-semibold">Quality First</h4>
                      <p className="text-gray-600 text-sm">Every product undergoes rigorous quality checks</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="font-semibold">Sustainable Practices</h4>
                      <p className="text-gray-600 text-sm">Eco-friendly materials and ethical manufacturing</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="font-semibold">Customer Focus</h4>
                      <p className="text-gray-600 text-sm">Your satisfaction is our top priority</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="font-semibold">Innovation</h4>
                      <p className="text-gray-600 text-sm">Constantly evolving with fashion trends</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

   
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Abhikrishna', role: 'CEO & Founder', bio: 'Fashion industry veteran with 15+ years experience' },
              { name: 'Sreelekshmi', role: 'Head of Design', bio: 'Award-winning designer with passion for sustainable fashion' },
              { name: 'Abhay Chand', role: 'Operations Director', bio: 'Supply chain expert ensuring smooth operations' }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-gray-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-500 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

 
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-gray-600">Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">30+</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;