import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../axios.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { Heart, MessageCircle, Package, Star, User, Users, Calendar, MapPin, Mail, ExternalLink } from 'lucide-react';
import ProductCard from "../components/ProductCard.jsx";
import CVCard from "../components/CVCard.jsx";

export default function UserProfile({ cart, addToCart, removeFromCart }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [profileUser, setProfileUser] = useState(null);
  const [userProducts, setUserProducts] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [userCVs, setUserCVs] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);

        // Fetch user profile
        const profileRes = await axios.get(`/api/users/${userId}/profile`);
        setProfileUser(profileRes.data);

        // Fetch user's products
        const productsRes = await axios.get(`/api/users/${userId}/products`);
        setUserProducts(Array.isArray(productsRes.data) ? productsRes.data : []);

        // Fetch user's favorites
        const favoritesRes = await axios.get(`/api/users/${userId}/favorites`);
        setUserFavorites(Array.isArray(favoritesRes.data) ? favoritesRes.data : []);

        // Fetch user's recent comments
        const commentsRes = await axios.get(`/api/users/${userId}/comments`);
        setUserComments(Array.isArray(commentsRes.data) ? commentsRes.data.slice(0, 3) : []); // Only recent 3

        // Fetch user's CVs
        const cvsRes = await axios.get(`/api/users/${userId}/cvs`);
        setUserCVs(Array.isArray(cvsRes.data) ? cvsRes.data : []);

        // Check if user is favorited (if logged in)
        if (user) {
          const favRes = await axios.get(`/api/users/${userId}/is-favorited`, { withCredentials: true });
          setIsFavorited(favRes.data.isFavorited);
        }

      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, user]);

  const handleFavoriteUser = async () => {
    if (!user) {
      toast.error("Please log in to favorite users");
      return;
    }

    try {
      if (isFavorited) {
        await axios.delete(`/api/users/${userId}/favorite`, { withCredentials: true });
        setIsFavorited(false);
        toast.success("Removed from favorites");
      } else {
        await axios.post(`/api/users/${userId}/favorite`, {}, { withCredentials: true });
        setIsFavorited(true);
        toast.success("Added to favorites");
      }
    } catch (err) {
      console.error("Error favoriting user:", err);
      toast.error("Failed to update favorites");
    }
  };

  const tabs = [
    { id: 'products', label: 'Products', icon: Package, count: userProducts.length },
    { id: 'favorites', label: 'Favorites', icon: Heart, count: userFavorites.length },
    { id: 'comments', label: 'Comments', icon: MessageCircle, count: userComments.length },
    { id: 'cvs', label: 'CVs', icon: Star, count: userCVs.length }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 via-pink-600 to-rose-600 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-300 rounded-2xl mb-6"></div>
            <div className="h-96 bg-gray-300 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 via-pink-600 to-rose-600 p-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">{error || "User not found"}</h2>
          <button
            onClick={() => navigate("/")}
            className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 via-pink-600 to-rose-600 p-3 sm:p-6">
      {/* Floating elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-400/15 to-rose-500/15 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Profile Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 mb-6 shadow-2xl border border-white/20 relative">
          {/* Favorite Icon in top right */}
          {user && user._id !== userId && (
            <button
              onClick={handleFavoriteUser}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300"
              title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'text-red-500 fill-current' : 'text-white'}`} />
            </button>
          )}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={profileUser.avatar || "https://via.placeholder.com/120x120/cccccc/000000?text=U"}
                alt={profileUser.username}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {profileUser.role && (
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {profileUser.role}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{profileUser.username}</h1>
              <p className="text-white/80 mb-4">{profileUser.bio || "No bio available"}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4 text-sm text-white/70">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(profileUser.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  <span>{userProducts.length} Products</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>{userCVs.length} CVs</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {user && user._id !== userId && (
                  <button
                    onClick={handleFavoriteUser}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      isFavorited
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-white/20 hover:bg-white/30 text-white border border-white/30"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                    {isFavorited ? "Favorited" : "Add to Favorites"}
                  </button>
                )}
                <button
                  onClick={() => navigate(`/messages/${userId}`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all duration-300"
                >
                  <Mail className="w-4 h-4" />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          <div className="flex flex-wrap gap-2 mb-6 border-b border-white/20 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-white text-gray-900 shadow-lg"
                    : "text-white hover:bg-white/20"
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
          <div className="min-h-[400px]">
            {activeTab === 'products' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Products by {profileUser.username}</h3>
                {userProducts.length === 0 ? (
                  <p className="text-white/70 text-center py-8">No products yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        p={product}
                        onToggleFavProp={() => {}}
                        isFav={false}
                        cart={cart}
                        addToCart={addToCart}
                        removeFromCart={removeFromCart}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">{profileUser.username}'s Favorite Products</h3>
                {userFavorites.length === 0 ? (
                  <p className="text-white/70 text-center py-8">No favorite products yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userFavorites.map((product) => (
                      <ProductCard
                        key={product._id}
                        p={product}
                        onToggleFavProp={() => {}}
                        isFav={false}
                        cart={cart}
                        addToCart={addToCart}
                        removeFromCart={removeFromCart}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'comments' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Recent Comments by {profileUser.username}</h3>
                {userComments.length === 0 ? (
                  <p className="text-white/70 text-center py-8">No comments yet</p>
                ) : (
                  <div className="space-y-4">
                    {userComments.map((comment) => (
                      <div key={comment._id} className="bg-white/10 rounded-lg p-4 border border-white/20">
                        <p className="text-white mb-2">{comment.text}</p>
                        <div className="text-sm text-white/60">
                          On product: <span className="font-semibold">{comment.productName}</span> • {new Date(comment.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'cvs' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">CVs by {profileUser.username}</h3>
                {userCVs.length === 0 ? (
                  <p className="text-white/70 text-center py-8">No CVs yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userCVs.map((cv) => (
                      <CVCard key={cv._id} cv={cv} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}