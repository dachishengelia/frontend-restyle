import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { Menu, X } from "lucide-react";
import BackButton from "./BackButton";
import logo from "../context/Untitled design.png";

export default function Navbar({ favoritesCount }) {
  const { user, loading, signOut } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Wait until auth is loaded
  if (loading) return null;

  // Normalize role
  const role = typeof user?.role === "string" ? user.role.toLowerCase() : "";

  // Role-based home path
  let homePath = "/";
  switch (role) {
    case "admin":
      homePath = "/";
      break;
    case "seller":
      homePath = "/";
      break;
    case "buyer":
      homePath = "/";
      break;
    default:
      homePath = "/";
  }

  return (
    <header className="bg-gray-900 border-gray-700 border-b shadow-2xl sticky top-0 z-20 transition-all duration-300 backdrop-blur-lg bg-opacity-90">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-5 px-6 md:px-8 relative">
        {/* Back Button - positioned absolutely to not affect layout */}
        {location.pathname !== "/" && <BackButton className="absolute left-0 top-1/2 -translate-y-1/2" />}
        {/* Logo */}
        <div className="flex items-center gap-4">
          <img src={logo} alt="logo" className="w-14 h-14 object-contain transition-transform hover:scale-105" />
          <Link to="/" className="font-bold text-2xl tracking-wide bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300">
            ReStyle
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {user && (
            <button
              onClick={() => navigate("/profile")}
              className="p-1 rounded-full hover:bg-cyan-500/20 transition-colors duration-200 hover:scale-105"
              title="Profile"
            >
              <img
                src={user.avatar || "https://via.placeholder.com/32x32/cccccc/000000?text=U"}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
            </button>
          )}

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3 rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:via-purple-500/20 hover:to-pink-500/20 transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-xl"
            title="Menu"
          >
            <div className="relative w-6 h-6">
              <Menu
                size={24}
                className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-180 scale-75' : 'opacity-100 rotate-0 scale-100'}`}
              />
              <X
                size={24}
                className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-75'}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className={`absolute top-full left-0 right-0 border-b shadow-2xl z-50 bg-gray-900 border-gray-700 transition-all duration-500 ease-in-out ${
        isMenuOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
          <nav className="flex flex-col items-center gap-3 py-4 px-4 text-white">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-full p-3 rounded-lg bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 hover:from-indigo-500/20 hover:via-purple-500/20 hover:to-pink-500/20 transition-all duration-300 text-lg hover:scale-105 hover:shadow-lg group"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl group-hover:rotate-12 transition-transform duration-300">
                {theme === "light" ? "☀️" : "🌙"}
              </span>
              <span className="font-medium text-sm">
                {theme === "light" ? "Light Mode" : "Dark Mode"}
              </span>
            </div>
          </button>

          {user && (
            <Link
              to="/explore"
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold hover:text-white transition-all duration-300 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:via-purple-500/20 hover:to-pink-500/20 hover:scale-105 hover:shadow-lg group"
            >
              <span className="text-base group-hover:rotate-12 transition-transform duration-300">🛍️</span>
              <span>Marketplace</span>
            </Link>
          )}

          {/* Favorites & Cart - Only show for logged in users */}
          {user && (
            <div className="flex flex-col gap-2 w-full">
              <Link
                to="/favorites"
                className="flex items-center justify-center gap-2 text-sm font-semibold hover:text-white transition-all duration-300 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:via-purple-500/20 hover:to-pink-500/20 hover:scale-105 hover:shadow-lg group"
              >
                <span className="text-base group-hover:scale-125 transition-transform duration-300">❤️</span>
                <span>Favorites</span>
                {favoritesCount > 0 && (
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                    {favoritesCount}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="flex items-center justify-center gap-2 text-sm font-semibold hover:text-white transition-all duration-300 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:via-purple-500/20 hover:to-pink-500/20 hover:scale-105 hover:shadow-lg group"
              >
                <span className="text-base group-hover:scale-125 transition-transform duration-300">🛒</span>
                <span>Cart</span>
                {cart.length > 0 && (
                  <span className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {cart.length}
                  </span>
                )}
              </Link>
            </div>
          )}

          {/* User buttons */}
          {user ? (
            <div className="w-full space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate("/add-cv")}
                  className="flex flex-col items-center gap-1 text-xs font-semibold text-white hover:text-white transition-all duration-300 px-2 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:via-purple-500/20 hover:to-pink-500/20 hover:scale-105 hover:shadow-lg group"
                >
                  <span className="text-sm group-hover:rotate-12 transition-transform duration-300">📄</span>
                  <span>Add CV</span>
                </button>
                <button
                  onClick={() => navigate("/cv-marketplace")}
                  className="flex flex-col items-center gap-1 text-xs font-semibold text-white hover:text-white transition-all duration-300 px-2 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:via-purple-500/20 hover:to-pink-500/20 hover:scale-105 hover:shadow-lg group"
                >
                  <span className="text-sm group-hover:rotate-12 transition-transform duration-300">👥</span>
                  <span>CV Market</span>
                </button>
              </div>

              {role === "seller" && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigate("/your-products")}
                    className="flex flex-col items-center gap-1 text-xs font-semibold text-white hover:text-white transition-all duration-300 px-2 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:via-purple-500/20 hover:to-pink-500/20 hover:scale-105 hover:shadow-lg group"
                  >
                    <span className="text-sm group-hover:rotate-12 transition-transform duration-300">📦</span>
                    <span>Your Products</span>
                  </button>
                  <button
                    onClick={() => navigate("/add-product")}
                    className="flex flex-col items-center gap-1 text-xs font-semibold text-white hover:text-white transition-all duration-300 px-2 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:via-purple-500/20 hover:to-pink-500/20 hover:scale-105 hover:shadow-lg group"
                  >
                    <span className="text-sm group-hover:rotate-12 transition-transform duration-300">➕</span>
                    <span>Add Product</span>
                  </button>
                </div>
              )}

              {role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white hover:text-white transition-all duration-300 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:via-purple-500/20 hover:to-pink-500/20 hover:scale-105 hover:shadow-lg group"
                >
                  <span className="text-sm group-hover:rotate-12 transition-transform duration-300">⚙️</span>
                  <span>Control Panel</span>
                </button>
              )}

              <button
                onClick={signOut}
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white hover:text-white transition-all duration-300 px-3 py-2 rounded-lg bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 hover:from-red-500/30 hover:to-red-600/30 hover:scale-105 hover:shadow-lg group"
              >
                <span className="text-sm group-hover:rotate-12 transition-transform duration-300">🚪</span>
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 px-4 py-2 rounded-lg hover:from-indigo-500/30 hover:via-purple-500/30 hover:to-pink-500/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-white/20"
            >
              <span className="text-base">🔐</span>
              <span>Log In / Sign Up</span>
            </Link>
          )}
        </nav>

      </div>
    </header>
  );
}
