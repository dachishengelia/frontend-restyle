import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { User, ShoppingBag, Store, CheckCircle } from 'lucide-react';
import axios from "../axios.js";

export default function CompleteGoogleProfile() {
  const [role, setRole] = useState('buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  
  const navigate = useNavigate();
  const { logIn } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  // Optional: you can remove this check if needed
  // useEffect(() => {
  //   const token = searchParams.get('token');
  //   if (!token) {
  //     navigate('/log-in');
  //   }
  // }, [searchParams, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      // Try to update with the new endpoint first
      const resp = await axios.post(
        "/api/auth/complete-profile",
        { role: role },
        { withCredentials: true }
      );

      if (resp.status === 200 || resp.status === 201) {
        const userData = resp.data.user;
        logIn(userData);
        toast.success('Welcome!');

        // Redirect based on role
        if (userData?.role === 'admin') navigate('/admin');
        else if (userData?.role === 'seller') navigate('/your-products');
        else navigate('/');
      }
    } catch (err) {
      // If endpoint doesn't exist, try fallback method
      try {
        const resp = await axios.put(
          "/api/auth/me",
          { role: role },
          { withCredentials: true }
        );

        if (resp.status === 200) {
          const userData = resp.data.user;
          logIn(userData);
          toast.success('Welcome!');

          if (userData?.role === 'admin') navigate('/admin');
          else if (userData?.role === 'seller') navigate('/your-products');
          else navigate('/');
        }
      } catch (fallbackErr) {
        const errorMsg = err.response?.data?.message || err.message || "Failed to save role";
        setError(errorMsg);
        console.error('Both endpoints failed:', err, fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
      
      <div
        className="w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-sm relative z-10 transform transition-all duration-500 hover:scale-105"
        style={{
          background: theme === 'dark'
            ? 'rgba(31, 41, 55, 0.8)'
            : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: theme === 'dark'
            ? '1px solid rgba(75, 85, 99, 0.3)'
            : '1px solid rgba(209, 213, 219, 0.3)'
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Choose Your Role
          </h1>
          <p className={`${theme === 'dark' ? 'text-indigo-100' : 'text-gray-600'}`}>
            How would you like to use Re-Style?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Role Selection */}
          <div className="flex flex-col gap-4">
            <label className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
              How do you want to use Re-Style?
            </label>
            
            {/* Buyer Option */}
            <label 
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 flex items-start gap-4 ${
                role === 'buyer' 
                  ? theme === 'dark'
                    ? 'border-indigo-400 bg-indigo-400/10'
                    : 'border-indigo-500 bg-indigo-50'
                  : theme === 'dark'
                    ? 'border-gray-600 bg-gray-700/20 hover:border-gray-500'
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="role"
                value="buyer"
                checked={role === 'buyer'}
                onChange={e => setRole(e.target.value)}
                className="mt-1 accent-indigo-500 w-5 h-5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingBag className="w-5 h-5 text-indigo-500" />
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    I want to buy fashion items
                  </span>
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Browse and purchase products from sellers
                </p>
              </div>
            </label>

            {/* Seller Option */}
            <label 
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 flex items-start gap-4 ${
                role === 'seller' 
                  ? theme === 'dark'
                    ? 'border-purple-400 bg-purple-400/10'
                    : 'border-purple-500 bg-purple-50'
                  : theme === 'dark'
                    ? 'border-gray-600 bg-gray-700/20 hover:border-gray-500'
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="role"
                value="seller"
                checked={role === 'seller'}
                onChange={e => setRole(e.target.value)}
                className="mt-1 accent-purple-500 w-5 h-5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Store className="w-5 h-5 text-purple-500" />
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    I want to sell fashion items
                  </span>
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  List and sell your products to customers
                </p>
              </div>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 rounded-lg py-3 border border-red-500/20">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden relative font-semibold"
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <span>{loading ? 'Setting up your account...' : 'Continue'}</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </form>

        {/* Info Footer */}
        <p className={`text-center mt-6 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          You can change your role anytime in your profile settings
        </p>
      </div>
    </div>
  );
}
