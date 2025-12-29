import React from 'react';
import { useShop } from '../../context/ShopContext';

const AdminLayout = ({ children }) => {
  const { currentUser, logout } = useShop();

  return (
    <div className="min-h-screen bg-gray-50">
      
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Manage your e-commerce store</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{currentUser?.name}</p>
              <p className="text-xs text-gray-500">{currentUser?.email}</p>
            </div>
            
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      
      <main className="p-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;