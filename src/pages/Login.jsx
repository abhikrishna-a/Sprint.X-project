import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { 
  Lock, Mail, User, Eye, EyeOff, 
  ArrowRight, ShoppingBag, Sparkles 
} from 'lucide-react';

const Login = () => {
  const { login, register } = useShop();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      return 'Please fill in all fields';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    
    if (!isLogin) {
      if (!formData.name.trim()) return 'Name is required';
      if (formData.name.length < 2) return 'Name must be at least 2 characters';
      if (formData.password !== formData.confirmPassword) {
        return 'Passwords do not match';
      }
      if (formData.password.length < 6) {
        return 'Password must be at least 6 characters';
      }
    }
    
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          // Check if user is admin
          if (result.user?.role === 'admin') {
            setSuccess('Admin login successful! Redirecting to admin dashboard...');
            setTimeout(() => {
              navigate('/admin/dashboard');
            }, 1500);
          } else {
            setSuccess('Login successful! Redirecting...');
            setTimeout(() => {
              navigate('/');
            }, 1500);
          }
        } else {
          setError(result.message || 'Login failed');
        }
      } else {
        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        if (result.success) {
          setSuccess('Account created successfully! Redirecting...');
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          setError(result.message || 'Registration failed');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  // REMOVED: Demo login buttons

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.05)_50%,transparent_75%)] bg-[length:100px_100px] opacity-20"></div>
      
      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-black to-gray-600 rounded-full blur opacity-30"></div>
              <div className="relative bg-white border border-gray-300 p-4 rounded-full">
                <ShoppingBag className="h-8 w-8 text-black" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-black mb-3 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Join Us'}
          </h1>
          <p className="text-gray-600">
            {isLogin 
              ? 'Sign in to your account' 
              : 'Create your account and start shopping today'
            }
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-300 rounded-2xl shadow-xl p-8 backdrop-blur-sm">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-300 rounded-xl flex items-center gap-3 animate-fadeIn">
              <div className="h-2 w-2 bg-green-600 rounded-full animate-pulse"></div>
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-300 rounded-xl flex items-center gap-3 animate-fadeIn">
              <div className="h-2 w-2 bg-red-600 rounded-full animate-pulse"></div>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

         

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field (Register only) */}
            {!isLogin && (
              <div className="group">
                <label className="block text-sm font-medium text-gray-600 mb-2 group-focus-within:text-black transition-colors">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-300 text-black pl-10 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-200 placeholder:text-gray-400"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-600 mb-2 group-focus-within:text-black transition-colors">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 text-black pl-10 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-200 placeholder:text-gray-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-600 mb-2 group-focus-within:text-black transition-colors">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 text-black pl-10 pr-12 py-3.5 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-black transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-black transition-colors" />
                  )}
                </button>
              </div>
              {!isLogin && (
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 6 characters
                </p>
              )}
            </div>

            {/* Confirm Password Field (Register only) */}
            {!isLogin && (
              <div className="group">
                <label className="block text-sm font-medium text-gray-600 mb-2 group-focus-within:text-black transition-colors">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-300 text-black pl-10 pr-12 py-3.5 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-200 placeholder:text-gray-400"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-black transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-black transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 group"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          {/* Toggle between Login/Register */}
          <div className="mt-8 pt-6 border-t border-gray-300">
            <p className="text-center text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={toggleView}
                className="font-semibold text-black hover:text-gray-800 transition-colors inline-flex items-center"
              >
                {isLogin ? 'Create one now' : 'Sign in here'}
                <Sparkles className="h-3 w-3 ml-1" />
              </button>
            </p>
          </div>

          {/* Forgot Password */}
          {isLogin && (
            <div className="mt-6 text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-gray-500 hover:text-black transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-black text-sm transition-colors duration-200 group"
          >
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© 2024 ShopNow. Elevating your shopping experience.</p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-64 h-64 bg-gradient-to-br from-black/5 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-black/5 to-transparent rounded-full translate-x-1/2 translate-y-1/2"></div>

      {/* Animation styles */}
    </div>
  );
};

export default Login;