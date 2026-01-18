import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { Heart, Users, Package, User } from 'lucide-react';
import axios from "../axios.js";

export default function Favorites({ products, favorites, toggleFav, cart, addToCart, removeFromCart }) {
   const { theme } = useContext(ThemeContext);
   const { user } = useContext(AuthContext);
   const navigate = useNavigate();

   const [activeTab, setActiveTab] = useState('products');
   const [favoriteUsers, setFavoriteUsers] = useState([]);
   const [loadingUsers, setLoadingUsers] = useState(false);
   const [sortBy, setSortBy] = useState('newest');

   const favoriteProducts = products.filter(p => favorites.includes(p._id));

   // Sort products based on selected option
   const sortedProducts = [...favoriteProducts].sort((a, b) => {
     switch (sortBy) {
       case 'oldest':
         return new Date(a.createdAt) - new Date(b.createdAt);
       case 'newest':
         return new Date(b.createdAt) - new Date(a.createdAt);
       case 'most-liked':
         return (b.likesCount || 0) - (a.likesCount || 0);
       default:
         return 0;
     }
   });

   // Fetch favorite users
   useEffect(() => {
     if (user && activeTab === 'users') {
       const fetchFavoriteUsers = async () => {
         setLoadingUsers(true);
         try {
           const res = await axios.get('/api/users/favorites', { withCredentials: true });
           setFavoriteUsers(res.data);
         } catch (err) {
           console.error("Error fetching favorite users:", err);
         } finally {
           setLoadingUsers(false);
         }
       };
       fetchFavoriteUsers();
     }
   }, [user, activeTab]);

   const handleUnfavoriteUser = async (userId) => {
     try {
       await axios.delete(`/api/users/${userId}/favorite`, { withCredentials: true });
       setFavoriteUsers(prev => prev.filter(u => u._id !== userId));
     } catch (err) {
       console.error("Error unfavoriting user:", err);
     }
   };

  const tabs = [
    { id: 'products', label: 'Products', icon: Package, count: favoriteProducts.length },
    { id: 'users', label: 'Users', icon: Users, count: favoriteUsers.length }
  ];

  return (
    <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          My Favorites
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                  : theme === "dark"
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200">Favorite Products</h2>
              {favoriteProducts.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`px-3 py-2 rounded-lg border text-sm ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-600 text-gray-200'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="most-liked">Most Liked</option>
                  </select>
                </div>
              )}
            </div>
            {favoriteProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} opacity-50`} />
                <p className="text-gray-700 dark:text-gray-300 text-lg">No favorite products yet.</p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Start exploring and add some products to your favorites!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedProducts.map((p) => (
                  <ProductCard
                    key={p._id}
                    p={p}
                    onDelete={null} // no delete action in favorites
                    onToggleFavProp={toggleFav}
                    isFav={favorites.includes(p._id)}
                    cart={cart}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-200">Favorite Users</h2>
            {loadingUsers ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-700 dark:text-gray-300">Loading favorite users...</p>
              </div>
            ) : favoriteUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} opacity-50`} />
                <p className="text-gray-700 dark:text-gray-300 text-lg">No favorite users yet.</p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Visit user profiles and add them to your favorites!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {favoriteUsers.map((favUser) => (
                  <div
                    key={favUser._id}
                    className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 hover:bg-gray-750'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => navigate(`/user/${favUser._id}`)}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={favUser.avatar || "https://via.placeholder.com/64x64/cccccc/000000?text=U"}
                        alt={favUser.username}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-200">{favUser.username}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{favUser.bio || "No bio"}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {favUser.productCount || 0} products • {favUser.cvCount || 0} CVs
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnfavoriteUser(favUser._id);
                        }}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors duration-200"
                        title="Remove from favorites"
                      >
                        <Heart className="w-5 h-5 fill-current" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
