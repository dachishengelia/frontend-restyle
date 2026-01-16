import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import axios from "../axios.js";

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { logIn } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const resp = await axios.post(
        "/api/auth/register",
        {
          username: fullName, // must be exactly "username"
          email,
          password,
          role
        },
        { withCredentials: true } // important to send cookies
      );

      const data = resp.data;

      if (resp.status === 201) {
        if (data.user) logIn(data.user); // update context immediately
        toast.success('User registered successfully');

        // Redirect depending on role
        if (data.user?.role === 'admin') navigate('/admin');
        else if (data.user?.role === 'seller') navigate('/your-products');
        else navigate('/');
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Something went wrong");
      console.error(e);
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
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Create Account</h1>
          <p className={`${theme === 'dark' ? 'text-indigo-100' : 'text-gray-600'}`}>Join our community today</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative group">
            <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400 group-focus-within:text-indigo-400' : 'text-gray-500 group-focus-within:text-indigo-600'}`} />
            <input
              type="text"
              placeholder="Nick Name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-700'
                  : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white'
              }`}
            />
          </div>
          <div className="relative group">
            <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400 group-focus-within:text-indigo-400' : 'text-gray-500 group-focus-within:text-indigo-600'}`} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-700'
                  : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white'
              }`}
            />
          </div>
          <div className="relative group">
            <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400 group-focus-within:text-indigo-400' : 'text-gray-500 group-focus-within:text-indigo-600'}`} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-700'
                  : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white'
              }`}
            />
          </div>
          <div className="flex flex-col gap-4">
            <label className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Select Role:</label>
            <div className="flex gap-6 justify-center">
              <label className={`flex items-center gap-3 cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ${theme === 'dark' ? 'bg-white/10 backdrop-blur-sm hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <input
                  type="radio"
                  name="role"
                  value="buyer"
                  checked={role === 'buyer'}
                  onChange={e => setRole(e.target.value)}
                  className="accent-indigo-500"
                />
                <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Buyer</span>
              </label>
              <label className={`flex items-center gap-3 cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ${theme === 'dark' ? 'bg-white/10 backdrop-blur-sm hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  checked={role === 'seller'}
                  onChange={e => setRole(e.target.value)}
                  className="accent-indigo-500"
                />
                <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Seller</span>
              </label>
            </div>
          </div>
          {error && <p className="text-red-400 text-sm text-center bg-red-500/10 rounded-lg py-2">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <UserPlus className="w-5 h-5" />
              <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </form>
        <p className={`text-center mt-8 ${theme === 'dark' ? 'text-indigo-100' : 'text-gray-600'}`}>
          Already have an account? <Link className={`font-semibold hover:underline transition-colors duration-300 ${theme === 'dark' ? 'text-white hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-800'}`} to="/log-in">Log In</Link>
        </p>
      </div>
    </div>
  );
}
