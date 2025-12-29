import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { EyeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const Orders = () => {
  const { orders, updateOrderStatus, getAllOrders } = useShop();
  const [orderDetails, setOrderDetails] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStatusInModal, setSelectedStatusInModal] = useState(null); 

  useEffect(() => {
    getAllOrders();
  }, [getAllOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      
      
      if (orderDetails && orderDetails.id === orderId) {
        setOrderDetails(prev => ({ ...prev, status: newStatus }));
        setSelectedStatusInModal(newStatus);
      }
      
      
      getAllOrders();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  
  useEffect(() => {
    if (orderDetails) {
      setSelectedStatusInModal(orderDetails.status);
    }
  }, [orderDetails]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
          <p className="text-gray-600">Manage customer orders</p>
        </div>
        <div className="flex space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.userName}</div>
                      <div className="text-sm text-gray-500">{order.userEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.total?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setOrderDetails(order)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'processing')}
                            className={`p-1 rounded ${
                              order.status === 'processing' 
                                ? 'bg-blue-100 text-blue-600' 
                                : 'text-gray-400 hover:text-blue-600'
                            }`}
                            title="Mark as Processing"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                          
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                            className="p-1 rounded text-gray-400 hover:text-red-600"
                            title="Cancel Order"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
      {orderDetails && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Order Details - {orderDetails.orderNumber}
              </h3>
              <button
                onClick={() => {
                  setOrderDetails(null);
                  setSelectedStatusInModal(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
             
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{orderDetails.userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{orderDetails.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Shipping Address</p>
                    <p className="font-medium">{orderDetails.shippingAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium">{orderDetails.paymentMethod}</p>
                  </div>
                </div>
              </div>

              
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">Order Items</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orderDetails.items?.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <img
                                src={item.image || 'https://via.placeholder.com/40'}
                                alt={item.name}
                                className="h-8 w-8 rounded mr-3"
                              />
                              <div>
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">${item.price?.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm font-medium">
                            ${(item.price * item.quantity)?.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${orderDetails.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>${orderDetails.shipping?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>${orderDetails.tax?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-medium">Total</span>
                    <span className="font-medium text-lg">${orderDetails.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">Update Status</h4>
                <div className="flex space-x-2">
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(orderDetails.id, status)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                        selectedStatusInModal === status || orderDetails.status === status
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setOrderDetails(null);
                  setSelectedStatusInModal(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;