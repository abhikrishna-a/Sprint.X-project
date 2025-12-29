// context/ShopContext.jsx (updated with analytics)
import  { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All', 'Sneakers', 'Cloth', 'Fitbands']);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  
  
  const [adminStats, setAdminStats] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null); // NEW: Analytics data state
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');

  const api = axios.create({
    baseURL: 'http://localhost:3001',
    timeout: 5000,
  });

  
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setCurrentUser(userData);
      loadUserCart(userData.id);
    }
    fetchAllData();
  }, []);

  
  const loadUserCart = async (userId) => {
    try {
      const response = await api.get(`/carts?userId=${userId}`);
      if (response.data.length > 0 && response.data[0].items) {
        setCart(response.data[0].items);
      }
      setIsCartLoaded(true);
    } catch (error) {
      console.error('Error loading cart:', error);
      setIsCartLoaded(true);
    }
  };

  
  const saveCartToServer = async () => {
    if (!currentUser) return;
    
    try {
      const existingCart = await api.get(`/carts?userId=${currentUser.id}`);
      if (existingCart.data.length > 0) {
        await api.patch(`/carts/${existingCart.data[0].id}`, {
          items: cart,
          updatedAt: new Date().toISOString()
        });
      } else {
        await api.post('/carts', {
          userId: currentUser.id,
          items: cart,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  
  useEffect(() => {
    if (currentUser && isCartLoaded) {
      saveCartToServer();
    }
  }, [cart]);

  

  
  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  
  const adminLogin = async (email, password) => {
    try {
      setAdminLoading(true);
      setAdminError('');
      
      const response = await api.get(`/users?email=${email}&password=${password}&role=admin`);
      
      if (response.data.length === 0) {
        setAdminError('Invalid admin credentials');
        return { success: false, message: 'Invalid admin credentials' };
      }
      
      const adminUser = response.data[0];
      const userData = {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      };
      
      setCurrentUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Admin login error:', error);
      setAdminError('Admin login failed');
      return { success: false, message: 'Admin login failed' };
    } finally {
      setAdminLoading(false);
    }
  };




  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }
  };


  const loadAnalytics = async () => {
    try {
      setAdminLoading(true);
      const data = await fetchAnalytics();
      setAnalyticsData(data);
      return data;
    } catch (error) {
      console.error('Error loading analytics:', error);
      return null;
    } finally {
      setAdminLoading(false);
    }
  };

  
  const fetchAdminStatsWithAnalytics = async () => {
    if (!isAdmin()) return;
    
    try {
      setAdminLoading(true);
      
      const [usersRes, productsRes, ordersRes, analyticsRes] = await Promise.all([
        api.get('/users'),
        api.get('/products'),
        api.get('/orders'),
        api.get('/analytics').catch(() => ({ data: null })) // Gracefully handle missing analytics
      ]);
      
      const allUsers = usersRes.data;
      const allProducts = productsRes.data;
      const allOrders = ordersRes.data;
      const analytics = analyticsRes?.data || null;
      
     
      const stats = {
        totalUsers: allUsers.length,
        totalProducts: allProducts.length,
        totalOrders: allOrders.length,
        totalRevenue: allOrders.reduce((sum, order) => sum + (order.total || 0), 0),
        recentOrders: allOrders.slice(-10).reverse(),
        lowStockProducts: allProducts.filter(p => p.stock < 10),
        topProducts: getTopProducts(allProducts, allOrders),
        allUsers: allUsers,
        allOrders: allOrders,
        allProducts: allProducts
      };
      
      setAdminStats(stats);
      setAnalyticsData(analytics);
      
    
      setUsers(allUsers);
      setOrders(allOrders);
      setProducts(allProducts);
      
      return { stats, analytics };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      setAdminError('Failed to load admin statistics');
      return null;
    } finally {
      setAdminLoading(false);
    }
  };

  
  const fetchAdminStats = async () => {
    if (!isAdmin()) return;
    
    try {
      setAdminLoading(true);
      
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        api.get('/users'),
        api.get('/products'),
        api.get('/orders')
      ]);
      
      const allUsers = usersRes.data;
      const allProducts = productsRes.data;
      const allOrders = ordersRes.data;
      
     
      const stats = {
        totalUsers: allUsers.length,
        totalProducts: allProducts.length,
        totalOrders: allOrders.length,
        totalRevenue: allOrders.reduce((sum, order) => sum + (order.total || 0), 0),
        recentOrders: allOrders.slice(-10).reverse(),
        lowStockProducts: allProducts.filter(p => p.stock < 10),
        topProducts: getTopProducts(allProducts, allOrders),
        allUsers: allUsers,
        allOrders: allOrders,
        allProducts: allProducts
      };
      
      setAdminStats(stats);
      
     
      setUsers(allUsers);
      setOrders(allOrders);
      setProducts(allProducts);
      
      return stats;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      setAdminError('Failed to load admin statistics');
      return null;
    } finally {
      setAdminLoading(false);
    }
  };

  
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes, ordersRes, usersRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
        api.get('/orders'),
        api.get('/users')
      ]);
      
      setProducts(productsRes.data);
      if (categoriesRes.data.length > 0) {
        const categoryNames = ['All', ...categoriesRes.data.map(cat => cat.name)];
        setCategories(categoryNames);
      }
      setOrders(ordersRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };


  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      const categoryNames = ['All', ...response.data.map(cat => cat.name)];
      setCategories(categoryNames);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

 
  const getAllUsers = async () => {
    try {
      const response = await api.get('/users');
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching all users:', error);
      return { data: [] };
    }
  };

  const getAllOrders = async () => {
    try {
      const response = await api.get('/orders');
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return { data: [] };
    }
  };

  const getAllProducts = async () => {
    try {
      const response = await api.get('/products');
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching all products:', error);
      return { data: [] };
    }
  };


  const getMonthlyAnalytics = () => {
    if (analyticsData?.monthlyRevenue) {
      return analyticsData.monthlyRevenue;
    }
    
 
    return calculateMonthlyRevenue(orders);
  };

  const getTopProductsAnalytics = () => {
    if (analyticsData?.topProducts) {
      return analyticsData.topProducts;
    }
    
   
    return getTopProducts(products, orders);
  };



 
  const addProduct = async (productData) => {
    try {
      const response = await api.post('/products', {
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      await fetchProducts();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const response = await api.patch(`/products/${id}`, {
        ...productData,
        updatedAt: new Date().toISOString()
      });
      await fetchProducts();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      await fetchProducts();
      return response;
    } catch (error) {
      throw error;
    }
  };

  
  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await api.patch(`/orders/${orderId}`, {
        status,
        updatedAt: new Date().toISOString()
      });
      await fetchOrders();
      return response;
    } catch (error) {
      throw error;
    }
  };

 
  const createUser = async (userData) => {
    try {
      const response = await api.post('/users', {
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      const response = await api.patch(`/users/${userId}`, { role });
      return response;
    } catch (error) {
      throw error;
    }
  };

 
  const calculateMonthlyRevenue = (orders) => {
    const months = {};
    const currentYear = new Date().getFullYear();
    
    orders.forEach(order => {
      const date = new Date(order.date || order.createdAt);
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth();
        months[month] = (months[month] || 0) + (order.total || 0);
      }
    });
    
    return Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2000, i, 1).toLocaleString('default', { month: 'short' }),
      revenue: months[i] || 0
    }));
  };

  const getTopProducts = (products, orders) => {
    const productSales = {};
    
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          productSales[item.id] = (productSales[item.id] || 0) + item.quantity;
        });
      }
    });
    
    return Object.entries(productSales)
      .map(([id, sales]) => ({
        id,
        name: products.find(p => p.id == id)?.name || 'Unknown',
        sales,
        revenue: sales * (products.find(p => p.id == id)?.price || 0)
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  };


  const getFilteredProducts = () => {
    if (selectedCategory === 'All') return products;
    return products.filter(product => product.category === selectedCategory);
  };

  const getFeaturedProducts = () => {
    return products.slice(0, 8);
  };

  
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const cartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          description: product.description,
          quantity: 1
        };
        return [...prevCart, cartItem];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

 
  const login = async (email, password) => {
    try {
      const response = await api.get(`/users?email=${email}`);
      
      if (response.data.length === 0) {
        return { success: false, message: 'No account found with this email' };
      }
      
      const user = response.data[0];
      
      if (user.password !== password) {
        return { success: false, message: 'Incorrect password' };
      }
      
      const userData = { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        role: user.role || 'user'
      };
      
      setCurrentUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      await loadUserCart(user.id);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const existingUsers = await api.get(`/users?email=${userData.email}`);
      
      if (existingUsers.data.length > 0) {
        return { success: false, message: 'Email already registered' };
      }
      
      const response = await api.post('/users', {
        ...userData,
        role: 'user',
        createdAt: new Date().toISOString()
      });
      
      const newUser = {
        id: response.data.id,
        name: userData.name,
        email: userData.email,
        role: 'user'
      };
      
      setCurrentUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
     
      await api.post('/carts', {
        userId: newUser.id,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    setIsCartLoaded(false);
    localStorage.removeItem('user');
  };

 
  const placeOrder = async (orderData) => {
    try {
      if (!currentUser) {
        return { success: false, message: 'Please login to place order' };
      }
      
      if (cart.length === 0) {
        return { success: false, message: 'Your cart is empty' };
      }

      const order = {
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: currentUser.name,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        items: cart,
        subtotal: getCartTotal(),
        shipping: 10.00,
        tax: getCartTotal() * 0.08,
        total: getCartTotal() + 10.00 ,
        date: new Date().toISOString(),
        status: 'pending',
        orderNumber: 'ORD-' + Date.now()
      };

      const response = await api.post('/orders', order);
      
      if (response.status === 201) {
        await clearCartFromServer();
        clearCart();
        return { 
          success: true, 
          orderId: response.data.id,
          orderNumber: order.orderNumber
        };
      }
    } catch (error) {
      console.error('Order error:', error);
    }
    return { success: false, message: 'Failed to place order' };
  };

  const clearCartFromServer = async () => {
    if (!currentUser) return;
    
    try {
      const existingCart = await api.get(`/carts?userId=${currentUser.id}`);
      if (existingCart.data.length > 0) {
        await api.patch(`/carts/${existingCart.data[0].id}`, {
          items: [],
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const fetchUserOrders = async () => {
    if (!currentUser) return [];
    
    try {
      const response = await api.get(`/orders?userId=${currentUser.id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  };

  
  return (
    <ShopContext.Provider
      value={{
       
        products,
        cart,
        currentUser,
        user: currentUser,
        selectedCategory,
        categories,
        orders,
        users,
        loading,
        
        
        adminStats,
        analyticsData, 
        adminLoading,
        adminError,
        isAdmin: isAdmin(),
        
        
        fetchProducts,
        fetchCategories,
        fetchOrders,
        fetchAllData,
        getFilteredProducts,
        getFeaturedProducts,
        
        
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        
        
        setSelectedCategory,
        
        
        login,
        register,
        logout,
        createUser,
        
        
        adminLogin,
        fetchAdminStats,
        fetchAdminStatsWithAnalytics, 
        getAllUsers,
        getAllOrders,
        getAllProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        deleteUser,
        updateUserRole,
        
        
        fetchAnalytics,
        loadAnalytics,
        getMonthlyAnalytics,
        getTopProductsAnalytics,
        
        
        placeOrder,
        fetchUserOrders,
        
        
        calculateMonthlyRevenue,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};