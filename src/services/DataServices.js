import React, { useEffect, useState } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  UsersIcon, 
  ShoppingCartIcon,
  CubeIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ChevronDownIcon,
  CalendarIcon,
  ChartBarIcon, 
  UserGroupIcon,
  TagIcon,
  ChartPieIcon,
  TrophyIcon, 
  FireIcon,
  ArrowUpIcon 
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { adminStats, fetchAdminStats, adminLoading, orders, products } = useShop();
  const [timeRange, setTimeRange] = useState('monthly');
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchAdminStats();
    fetchAnalyticsData();
  }, []);

 
  const fetchAnalyticsData = async () => {
    try {
      
      const mockAnalytics = {
        monthlySales: [
          { month: 'Jan', sales: 4200 },
          { month: 'Feb', sales: 3800 },
          { month: 'Mar', sales: 5100 },
          { month: 'Apr', sales: 6200 },
          { month: 'May', sales: 7300 },
          { month: 'Jun', sales: 8900 },
          { month: 'Jul', sales: 7500 },
          { month: 'Aug', sales: 8200 },
          { month: 'Sep', sales: 6800 },
          { month: 'Oct', sales: 9200 },
          { month: 'Nov', sales: 8500 },
          { month: 'Dec', sales: 9500 }
        ],
        recentActivity: [
          { id: 1, user: 'Abhikrishna A', action: 'placed order', time: '2 days ago' },
          { id: 2, user: 'abhi krishna', action: 'registered', time: '1 day ago' },
          { id: 3, user: 'Admin User', action: 'added product', time: '3 hours ago' },
          { id: 4, user: 'Abhikrishna A', action: 'added review', time: '5 hours ago' }
        ],
        categoryStats: [
          { category: 'Sneakers', revenue: 12560, orders: 92 },
          { category: 'Cloth', revenue: 3240, orders: 45 },
          { category: 'Fitbands', revenue: 928, orders: 12 }
        ]
      };
      setAnalyticsData(mockAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  // Calculate metrics from your data
  const calculateMetrics = () => {
    if (!adminStats) return null;
    
    const totalOrders = orders?.length || 0;
    const monthlyRevenue = analyticsData?.monthlySales?.reduce((sum, month) => sum + month.sales, 0) || 0;
    const todayRevenue = 3287;
    const monthlyTarget = 20000;
    const targetAchievement = ((monthlyRevenue / monthlyTarget) * 100).toFixed(1);
    
    return {
      monthlyRevenue,
      todayRevenue,
      monthlyTarget,
      targetAchievement,
      totalOrders,
      avgOrderValue: monthlyRevenue / (totalOrders || 1)
    };
  };

  const metrics = calculateMetrics();

  if (adminLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!adminStats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Main stat cards using available icons
  const mainStatCards = [
    {
      title: 'Monthly Sales',
      value: `$${metrics?.monthlyRevenue?.toLocaleString() || '0'}`,
      subtext: 'Target you\'ve set for each month',
      icon: ChartBarIcon, // Using ChartBarIcon instead of TargetIcon
      color: 'bg-blue-100 text-blue-600',
      achievement: `${metrics?.targetAchievement}%`
    },
    {
      title: 'Monthly Target',
      value: `$${metrics?.monthlyTarget?.toLocaleString() || '0'}`,
      subtext: 'Target you\'ve set for each month',
      icon: TrophyIcon, // Using TrophyIcon instead of TargetIcon
      color: 'bg-purple-100 text-purple-600',
      achievement: '100%'
    },
    {
      title: 'Today\'s Revenue',
      value: `$${metrics?.todayRevenue?.toLocaleString() || '0'}`,
      subtext: `$${metrics?.todayRevenue || '0'} today, it's higher than last month`,
      icon: FireIcon, // Using FireIcon for today's hot revenue
      color: 'bg-green-100 text-green-600',
      achievement: '+15%'
    }
  ];

  // Additional stats using UsersIcon
  const userStats = [
    {
      title: 'Total Users',
      value: adminStats.totalUsers || 0,
      icon: UsersIcon,
      color: 'bg-indigo-100 text-indigo-600',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Total Products',
      value: adminStats.totalProducts || 0,
      icon: CubeIcon,
      color: 'bg-amber-100 text-amber-600',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Total Orders',
      value: adminStats.totalOrders || 0,
      icon: ShoppingCartIcon,
      color: 'bg-rose-100 text-rose-600',
      change: '+23%',
      trend: 'up'
    },
    {
      title: 'Total Revenue',
      value: `$${adminStats.totalRevenue?.toFixed(2) || '0'}`,
      icon: CurrencyDollarIcon,
      color: 'bg-emerald-100 text-emerald-600',
      change: '+18%',
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome to your admin dashboard</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['Year', 'Monthly', 'Quarterly', 'Annually'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range.toLowerCase())}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range.toLowerCase() 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stats Grid - Using ChartBarIcon, TrophyIcon, FireIcon */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mainStatCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`
                h-12 w-12 rounded-lg flex items-center justify-center ${stat.color}
              `}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">Achievement</span>
                <div className="flex items-center justify-end">
                  <span className="text-lg font-bold text-green-600">
                    {stat.achievement}
                  </span>
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 ml-1" />
                </div>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
              <p className="text-xs text-gray-500 mt-2">{stat.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Stats Grid - Using UsersIcon, CubeIcon, etc. */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Sales Chart Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Monthly Sales</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
            View Details
            <ChevronDownIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        {/* Sales Chart Visualization */}
        <div className="h-64 flex items-end space-x-2 pt-6">
          {analyticsData?.monthlySales?.map((monthData, index) => {
            const maxSales = Math.max(...analyticsData.monthlySales.map(m => m.sales));
            const height = (monthData.sales / maxSales) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg"
                  style={{ height: `${height}%` }}
                ></div>
                <p className="text-xs text-gray-600 mt-2">{monthData.month}</p>
                <p className="text-xs font-semibold text-gray-900">${(monthData.sales/1000).toFixed(1)}K</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
            <CalendarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analyticsData?.recentActivity?.map((activity) => (
              <div key={activity.id} className="flex items-center">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <UserGroupIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-semibold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Statistics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Category Stats</h3>
            <TagIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analyticsData?.categoryStats?.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center mr-3 ${
                    index === 0 ? 'bg-blue-100 text-blue-600' :
                    index === 1 ? 'bg-purple-100 text-purple-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <CubeIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{category.category}</p>
                    <p className="text-xs text-gray-500">{category.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${category.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
            <ShoppingCartIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {adminStats.recentOrders?.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{order.userName}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${order.total?.toFixed(2)}</p>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;