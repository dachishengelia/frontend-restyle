import React, { useContext, useState, useEffect } from "react";
import axios from "../axios.js"; // use your axios instance
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, CreditCard, Edit, Trash2, ThumbsUp, ThumbsDown } from 'lucide-react';

import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { toast } from "react-toastify";

export default function ProductCard({
  p,
  onDelete,
  onToggleFavProp,
  isFav,
  cart,
  addToCart,
  removeFromCart,
}) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);

  // Initialize counts from product data
  useEffect(() => {
    setLikesCount(p.likesCount || 0);
    setDislikesCount(p.dislikesCount || 0);
  }, [p.likesCount, p.dislikesCount]);

  const isInCart = Array.isArray(cart) && cart.some((item) => item.id === p._id);

  // Check if user is the seller of this product
  const isOwnProduct = user?.role === "seller" && (p.sellerId === user._id || p.sellerId?._id === user._id);

  // Add or remove product from cart
  const handleCartAction = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart) {
      removeFromCart(p._id);
      toast.success("Removed from cart");
    } else {
      addToCart(p._id);
      toast.success("Added to cart");
    }
  };

  // Edit product
  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit-product/${p._id}`);
  };

  // Checkout single product
  const handleCheckout = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const transformedItem = {
        name: p.name,
        price: p.price,
        quantity: 1,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_PROD}/api/checkout/create-checkout-session`,
        { items: [transformedItem] },
        { withCredentials: true }
      );

      window.location.href = res.data.url;
    } catch (err) {
      console.error("Payment failed:", err);
      toast.error(err.response?.data?.message || "Payment failed");
    }
  };

  // Delete product (admin/seller)
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!p?._id || !onDelete) return;
    try {
      await onDelete(p._id);
    } catch (err) {
      console.error("Failed to delete product:", err);
      toast.error("Failed to delete product");
    }
  };

  // Toggle favorite
  const handleToggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavProp) {
      onToggleFavProp(p._id);
      if (isFav) {
        toast.success("Removed from favorites");
      } else {
        toast.success("Added to favorites");
      }
    }
  };

  // Handle like
  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please log in to like");
      return;
    }
    try {
      const res = await axios.post(`/api/product-actions/${p._id}/like`, {}, {
        withCredentials: true
      });
      setLikesCount(res.data.likesCount);
      setDislikesCount(res.data.dislikesCount);
      setUserLiked(res.data.liked);
      setUserDisliked(false);
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error("Product not found");
      } else {
        toast.error("Server error");
      }
    }
  };

  // Handle dislike
  const handleDislike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please log in to dislike");
      return;
    }
    try {
      const res = await axios.post(`/api/product-actions/${p._id}/dislike`, {}, {
        withCredentials: true
      });
      setLikesCount(res.data.likesCount);
      setDislikesCount(res.data.dislikesCount);
      setUserDisliked(res.data.disliked);
      setUserLiked(false);
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error("Product not found");
      } else {
        toast.error("Server error");
      }
    }
  };

  if (!p) return null;

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1 cursor-pointer backdrop-blur-sm ${
        theme === "dark"
          ? "bg-gray-800/80 border border-gray-600/50"
          : "bg-white/90 border border-gray-200/50"
      }`}
      style={{
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      onClick={() => navigate(`/product/${p._id}`)}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
        <img
          src={
            p.imageUrl
              ? p.imageUrl.replace("/upload/", "/upload/w_400,h_192,c_fill/")
              : "/placeholder.png"
          }
          alt={p.name}
          className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
        />
        {p.discount > 0 && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20">
            {p.discount}% OFF
          </span>
        )}
        {p.secondhand && (
          <span className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20">
            2nd Hand
          </span>
        )}
      </div>

      <div className="p-6 relative">
        <div
          className={`rounded-xl p-4 backdrop-blur-md ${
            theme === "dark"
              ? "bg-gray-700/30 border border-gray-600/30"
              : "bg-gray-100/50 border border-gray-200/30"
          }`}
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
        <div className="flex justify-between items-start">
          <h3 className={`${theme === "dark" ? "text-gray-200" : "text-gray-900"} font-semibold`}>
            {p.name}
          </h3>
          <button
            type="button"
            onClick={handleToggleFav}
            className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
              isFav
                ? "bg-red-500/20 text-red-500"
                : theme === "dark"
                ? "bg-gray-600/50 text-gray-400 hover:bg-red-500/20 hover:text-red-400"
                : "bg-gray-200/50 text-gray-500 hover:bg-red-500/20 hover:text-red-400"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        <p className={`text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          {p.category}
        </p>

        {p.sizes?.length > 0 && (
          <p className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            Sizes: {p.sizes.join(", ")}
          </p>
        )}
        {p.colors?.length > 0 && (
          <p className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            Colors: {p.colors.join(", ")}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between">
          <div className={`${theme === "dark" ? "text-gray-200" : "text-gray-900"} text-lg font-bold`}>
            {p.price} GEL
          </div>
        </div>

        {/* Like/Dislike Buttons - Only show if not own product */}
        {!isOwnProduct && (
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105 ${
                userLiked
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                  : theme === "dark"
                  ? "bg-gray-700/50 text-gray-200 hover:bg-blue-500/20 hover:text-blue-400 border border-gray-600/50"
                  : "bg-gray-200/50 text-gray-700 hover:bg-blue-500/20 hover:text-blue-400 border border-gray-300/50"
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              {userLiked && <span>{likesCount}</span>}
            </button>
            <button
              type="button"
              onClick={handleDislike}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105 ${
                userDisliked
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                  : theme === "dark"
                  ? "bg-gray-700/50 text-gray-200 hover:bg-red-500/20 hover:text-red-400 border border-gray-600/50"
                  : "bg-gray-200/50 text-gray-700 hover:bg-red-500/20 hover:text-red-400 border border-gray-300/50"
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              {userDisliked && <span>{dislikesCount}</span>}
            </button>
          </div>
        )}

        {/* Add/Remove Cart - Only show if not own product */}
        {!isOwnProduct && (
          <>
            <button
              type="button"
              onClick={handleCartAction}
              className={`mt-4 w-full py-3 rounded-xl text-white transition-all duration-300 transform hover:scale-105 min-h-[44px] overflow-hidden relative ${
                isInCart
                  ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              }`}
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>{isInCart ? "Remove from Cart" : "Add to Cart"}</span>
              </span>
              <div className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 ${
                isInCart
                  ? "bg-gradient-to-r from-red-600 to-red-700"
                  : "bg-gradient-to-r from-blue-600 to-blue-700"
              }`}></div>
            </button>

            {/* Buy Now */}
            <button
              type="button"
              onClick={handleCheckout}
              className="mt-3 w-full py-3 rounded-xl text-white transition-all duration-300 transform hover:scale-105 min-h-[44px] overflow-hidden relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Buy Now</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </>
        )}

        {/* Edit - Only show for own product */}
        {isOwnProduct && (
          <button
            type="button"
            onClick={handleEdit}
            className="mt-4 w-full py-3 rounded-xl text-white transition-all duration-300 transform hover:scale-105 min-h-[44px] overflow-hidden relative bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <Edit className="w-5 h-5" />
              <span>Edit Product</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        )}

        {/* Admin/Seller Delete */}
        {(user?.role === "admin" || (user?.role === "seller" && (p.sellerId === user._id || p.sellerId?._id === user._id))) && (
          <button
            type="button"
            onClick={handleDelete}
            className={`mt-3 w-full py-3 rounded-xl text-white transition-all duration-300 transform hover:scale-105 min-h-[44px] overflow-hidden relative ${
              theme === "dark"
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                : "bg-gradient-to-r from-gray-100 to-gray-200 text-red-500 hover:from-red-500 hover:to-red-600 hover:text-white"
            }`}
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <Trash2 className="w-5 h-5" />
              <span>Delete</span>
            </span>
            <div className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 ${
              theme === "dark"
                ? "bg-gradient-to-r from-red-600 to-red-700"
                : "bg-gradient-to-r from-red-500 to-red-600"
            }`}></div>
          </button>
        )}
        </div>
      </div>
    </div>
  );
}

