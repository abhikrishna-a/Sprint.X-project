import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const navigate = useNavigate();
  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: HomeIcon },
    { name: 'Products', path: '/admin/products', icon: CubeIcon },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCartIcon },
    { name: 'Users', path: '/admin/users', icon: UsersIcon },
  ];

  const handleLogout = () => {
    
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black text-white flex flex-col">
    
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold text-white">Admin</h2>
        <p className="text-gray-400 text-sm mt-1">Sprint.X</p>
      </div>
      
      
      <nav className="mt-8 flex-1">
        <ul className="space-y-1 px-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white text-black'
                      : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-3 bg-white text-black hover:bg-gray-200 rounded-lg transition-colors font-medium"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
          Logout
        </button>
      </div>

      
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-white rounded-full mr-2"></div>
          <div className="ml-1">
            <p className="text-sm font-medium text-white">Admin Panel v1.0</p>
            <p className="text-xs text-gray-400">All systems operational</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;