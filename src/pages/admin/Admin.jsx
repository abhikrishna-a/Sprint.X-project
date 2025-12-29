import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import Dashboard from './AdminDashboard';
import Products from './AdminProduct';
import Orders from './AdminOrder';
import Users from './AdminUsers';
import Sidebar from './Adminsidebar';

const Admin = () => {
  const { currentUser } = useShop();
  const isAuthenticated = currentUser?.role === 'admin';

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;