import React, { useEffect, useState } from "react";
import axios from "../axios.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  ArrowLeft,
  Loader,
  RefreshCw,
  Package,
  DollarSign
} from "lucide-react";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animatingQuantity, setAnimatingQuantity] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get("/api/cart", { withCredentials: true });
        setCartItems(data.items || []);
      } catch (err) {
        setError("Failed to fetch cart items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    setAnimatingQuantity(productId);
    try {
      const { data } = await axios.patch(
        `/api/cart/${productId}`,
        { quantity },
        { withCredentials: true }
      );
      setCartItems(data.items);
    } catch (err) {
      setError("Failed to update item quantity. Please try again.");
    } finally {
      setTimeout(() => setAnimatingQuantity(null), 300);
    }
  };

  const handleRemoveItem = async (productId) => {
    setRemovingItem(productId);
    try {
      const { data } = await axios.delete(`/api/cart/${productId}`, { withCredentials: true });
      setCartItems(data.items);
    } catch (err) {
      setError("Failed to remove item from cart. Please try again.");
    } finally {
      setTimeout(() => setRemovingItem(null), 300);
    }
  };

  const handleClearCart = async () => {
    try {
      await axios.delete("/api/cart", { withCredentials: true });
      setCartItems([]);
    } catch (err) {
      setError("Failed to clear cart. Please try again.");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Add items before proceeding to checkout.");
      return;
    }
    navigate("/checkout");
  };

  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/3 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/3 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center max-w-md mx-auto p-8 rounded-3xl backdrop-blur-sm bg-white/10 border border-white/20">
          <div className="text-red-300 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-red-100 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/30"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 relative overflow-hidden">
      {/* Animated Background decorative elements */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/3 rounded-full blur-3xl animate-bounce"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-spin" style={{animationDuration: '20s'}}></div>
      {/* Additional floating elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-2xl opacity-30 animate-ping" style={{animationDuration: '3s'}}></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse" style={{animationDuration: '4s'}}></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-bounce" style={{animationDelay: '1s'}}></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 animate-bounce">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent">
              Your Shopping Cart
            </h1>
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 animate-pulse">
              <Package className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-indigo-100 text-lg">Review your items and proceed to checkout</p>
          {/* Decorative elements */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-20">
            <div className="max-w-md mx-auto p-8 rounded-3xl backdrop-blur-sm bg-white/10 border border-white/20">
              <div className="text-8xl mb-6">🛒</div>
              <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
              <p className="text-indigo-100 mb-8">Looks like you haven't added any items yet. Start shopping to fill it up!</p>
              <button
                onClick={() => navigate("/explore")}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Package className="w-6 h-6" />
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.product._id}
                  className={`group p-6 rounded-3xl backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 transform hover:scale-[1.02] shadow-2xl hover:shadow-cyan-500/20 ${removingItem === item.product._id ? 'opacity-50 scale-95' : ''}`}
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div className="flex items-center gap-6">
                    {/* Product Image */}
                    <div className="relative">
                      <img
                        src={item.product.imageUrl || "/placeholder.png"}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-2xl shadow-lg border-2 border-white/20"
                      />
                      {item.product.discount > 0 && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{item.product.discount}%
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{item.product.name}</h3>
                      <div className="flex items-center gap-4 text-indigo-100">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {item.product.price} GEL
                        </span>
                        {item.product.sizes?.length > 0 && (
                          <span className="text-sm">Size: {item.product.sizes.join(", ")}</span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-2 backdrop-blur-sm border border-white/20">
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                        className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-200 hover:scale-110"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className={`px-4 py-2 bg-white/20 text-white font-semibold rounded-lg min-w-[3rem] text-center transition-all duration-300 ${animatingQuantity === item.product._id ? 'animate-pulse scale-110' : ''}`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                        className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-200 hover:scale-110"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Item Total & Remove */}
                    <div className="text-right">
                      <div className="text-xl font-bold text-white mb-2">
                        {(item.product.price * item.quantity).toFixed(2)} GEL
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.product._id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-xl transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-red-500/30"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="p-8 rounded-3xl backdrop-blur-sm bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden">
                  {/* Subtle background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-3xl"></div>
                  <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <CreditCard className="w-6 h-6" />
                    Order Summary
                  </h3>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-indigo-100">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span className="font-semibold">{total.toFixed(2)} GEL</span>
                    </div>
                    <div className="flex justify-between items-center text-indigo-100">
                      <span>Shipping</span>
                      <span className="font-semibold text-green-300">Free</span>
                    </div>
                    <div className="flex justify-between items-center text-indigo-100">
                      <span>Tax</span>
                      <span className="font-semibold">{(total * 0.18).toFixed(2)} GEL</span>
                    </div>
                    <div className="border-t border-white/20 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-white">Total</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                          {(total * 1.18).toFixed(2)} GEL
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={handleCheckout}
                      className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                    >
                      <CreditCard className="w-6 h-6" />
                      Proceed to Checkout
                    </button>

                    <button
                      onClick={handleClearCart}
                      className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-red-500/30 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Clear Cart
                    </button>

                    <button
                      onClick={() => navigate("/explore")}
                      className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/20 flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Continue Shopping
                    </button>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
