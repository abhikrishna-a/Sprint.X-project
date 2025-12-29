import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import Home from './pages/Home';
import Collection from './pages/Collection';
import Product from './pages/Product';
import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/admin/Admin';

const App = () => {
  return (
    <Router>
      <ShopProvider>
        <Routes>
          {/* Main layout with Navbar & Footer for regular pages */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/placeorder" element={
              <ProtectedRoute>
                <PlaceOrder />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Admin routes - no Navbar/Footer */}
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </ShopProvider>
    </Router>
  );
};


const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};


const ProtectedRoute = ({ children }) => {
  const { currentUser } = useShop();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default App;