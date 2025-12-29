import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const Orders = () => {
  const { currentUser, fetchUserOrders } = useShop();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const loadOrders = async () => {
      const userOrders = await fetchUserOrders();
      setOrders(userOrders);
      setLoading(false);
    };

    loadOrders();
  }, [currentUser]);

  if (!currentUser) {
    return null; 
  }


  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        setCancellingOrderId(orderId);
     

        setTimeout(() => {
          setOrders(prevOrders => 
            prevOrders.map(order => 
              order.id === orderId 
                ? { ...order, status: 'cancelled' } 
                : order
            )
          );
          setCancellingOrderId(null);
          alert('Order cancelled successfully!');
        }, 500);
      } catch (error) {
        alert('Failed to cancel order. Please try again.');
        setCancellingOrderId(null);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  const canCancelOrder = (orderStatus) => {
    const cancellableStatuses = ['pending', 'processing'];
    return cancellableStatuses.includes(orderStatus.toLowerCase());
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <button
            onClick={() => navigate('/collection')}
            className="bg-black text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-800"
          >
            Continue Shopping
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <div className="text-gray-400 mb-6">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-8">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/collection')}
              className="bg-black text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-800"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                    <p className="text-gray-600">Placed on {formatDate(order.date)}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-2 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  
                    {canCancelOrder(order.status) && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingOrderId === order.id}
                        className={`px-4 py-1.5 rounded-md font-medium text-sm ${
                          cancellingOrderId === order.id
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        {cancellingOrderId === order.id ? (
                          <span className="flex items-center">
                            <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-2"></span>
                            Cancelling...
                          </span>
                        ) : (
                          'Cancel Order'
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <p className="text-gray-600">{order.shippingAddress}</p>  
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Items</h4>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded mr-4"
                          />
                          <div className="flex-grow">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t mt-6 pt-6">
                    <div className="flex justify-between items-center">
                      <div className="text-right">
                        <p className="text-gray-600">Total Amount</p>
                        <p className="text-2xl font-bold">${order.total}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;