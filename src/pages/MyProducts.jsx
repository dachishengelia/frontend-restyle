import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "../axios.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { toast } from "react-toastify";
import { Package, Plus, Edit, Trash2, Eye, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';

export default function MyProducts() {
    const { user } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        totalViews: 0,
        totalSales: 0
    });

    useEffect(() => {
        if (user?.role === "seller") {
            fetchProducts();
        }
    }, [user]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get("/api/products/seller");
            setProducts(res.data);

            // Calculate stats
            const total = res.data.length;
            const active = res.data.filter(p => p.isActive !== false).length;
            const totalViews = res.data.reduce((sum, p) => sum + (p.views || 0), 0);
            const totalSales = res.data.reduce((sum, p) => sum + (p.sales || 0), 0);

            setStats({ total, active, totalViews, totalSales });
        } catch (err) {
            console.error("Failed to fetch products:", err);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await axios.delete(`/api/products/${productId}`);
            setProducts(products.filter(p => p._id !== productId));
            toast.success("Product deleted successfully");
        } catch (err) {
            console.error("Failed to delete product:", err);
            toast.error("Failed to delete product");
        }
    };

    if (user?.role !== "seller") {
        return (
            <div className="text-center py-12">
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    This section is only available for sellers.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    My Products
                </h1>
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Manage your product listings and track performance
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className={`p-6 rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-gradient-to-br from-blue-600/20 to-blue-700/20 backdrop-blur-md border border-blue-500/50' : 'bg-gradient-to-br from-blue-50 to-blue-100 backdrop-blur-md border border-blue-200'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>Total Products</p>
                            <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
                        </div>
                        <Package className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                    </div>
                </div>

                <div className={`p-6 rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-gradient-to-br from-green-600/20 to-green-700/20 backdrop-blur-md border border-green-500/50' : 'bg-gradient-to-br from-green-50 to-green-100 backdrop-blur-md border border-green-200'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`}>Active Products</p>
                            <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.active}</p>
                        </div>
                        <TrendingUp className={`w-8 h-8 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />
                    </div>
                </div>

                <div className={`p-6 rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-gradient-to-br from-purple-600/20 to-purple-700/20 backdrop-blur-md border border-purple-500/50' : 'bg-gradient-to-br from-purple-50 to-purple-100 backdrop-blur-md border border-purple-200'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}>Total Views</p>
                            <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.totalViews}</p>
                        </div>
                        <Eye className={`w-8 h-8 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`} />
                    </div>
                </div>

                <div className={`p-6 rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-gradient-to-br from-orange-600/20 to-orange-700/20 backdrop-blur-md border border-orange-500/50' : 'bg-gradient-to-br from-orange-50 to-orange-100 backdrop-blur-md border border-orange-200'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-orange-300' : 'text-orange-600'}`}>Total Sales</p>
                            <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.totalSales}</p>
                        </div>
                        <ShoppingCart className={`w-8 h-8 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'}`} />
                    </div>
                </div>
            </div>

            {/* Add Product Button */}
            <div className="mb-8">
                <Link
                    to="/add-product"
                    className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        theme === 'dark'
                            ? 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/50'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300'
                    }`}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Product
                </Link>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className={`text-center py-12 px-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <Package className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                    <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        No products yet
                    </h3>
                    <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Start selling by adding your first product
                    </p>
                    <Link
                        to="/add-product"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Your First Product
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className={`rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] overflow-hidden ${
                                theme === 'dark'
                                    ? 'bg-gradient-to-br from-gray-800/70 to-gray-700/70 backdrop-blur-md border border-gray-600/50'
                                    : 'bg-white/90 backdrop-blur-md border border-gray-200/50'
                            }`}
                        >
                            <div className="relative">
                                <img
                                    src={product.imageUrl || '/placeholder.png'}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <Link
                                        to={`/edit-product/${product._id}`}
                                        className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
                                    >
                                        <Edit className="w-4 h-4 text-white" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="p-2 bg-red-500/20 backdrop-blur-md rounded-full hover:bg-red-500/30 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {product.name}
                                </h3>
                                <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {product.category}
                                </p>
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {product.price} GEL
                                    </span>
                                    <div className="flex items-center space-x-4 text-sm">
                                        <div className={`flex items-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            <Eye className="w-4 h-4 mr-1" />
                                            {product.views || 0}
                                        </div>
                                        <div className={`flex items-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            <ShoppingCart className="w-4 h-4 mr-1" />
                                            {product.sales || 0}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <Link
                                        to={`/product/${product._id}`}
                                        className={`flex-1 py-2 px-4 rounded-lg text-center font-semibold transition-all duration-300 ${
                                            theme === 'dark'
                                                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        View
                                    </Link>
                                    <Link
                                        to={`/edit-product/${product._id}`}
                                        className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-center font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}