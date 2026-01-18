import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import axios from "../axios.js";
import { User, Package, FileText, Star, TrendingUp, Calendar, MapPin } from 'lucide-react';

export default function ProfileOverview() {
    const { user } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const [stats, setStats] = useState({
        products: 0,
        cvs: 0,
        favorites: 0,
        orders: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch user stats
                const [productsRes, cvsRes] = await Promise.all([
                    user?.role === "seller" ? axios.get("/api/products/seller") : Promise.resolve({ data: [] }),
                    axios.get("/api/cv/user")
                ]);

                setStats({
                    products: productsRes.data.length,
                    cvs: cvsRes.data.cvs?.length || 0,
                    favorites: 0, // Would need to fetch from favorites API
                    orders: 0 // Would need to fetch from orders API
                });

                // Mock recent activity
                setRecentActivity([
                    { type: 'cv', action: 'Updated CV', date: '2024-01-15' },
                    { type: 'product', action: 'Added new product', date: '2024-01-10' },
                    { type: 'profile', action: 'Updated profile picture', date: '2024-01-05' }
                ]);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user]);

    const statCards = [
        {
            title: "My Products",
            value: stats.products,
            icon: Package,
            color: "from-blue-500 to-blue-600",
            link: "/profile/products",
            show: user?.role === "seller"
        },
        {
            title: "My CVs",
            value: stats.cvs,
            icon: FileText,
            color: "from-green-500 to-green-600",
            link: "/profile/cvs"
        },
        {
            title: "Favorites",
            value: stats.favorites,
            icon: Star,
            color: "from-yellow-500 to-orange-500",
            link: "/favorites"
        },
        {
            title: "Orders",
            value: stats.orders,
            icon: TrendingUp,
            color: "from-purple-500 to-pink-500",
            link: "/cart"
        }
    ].filter(card => !card.show || card.show);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Welcome back, {user?.username}!
                </h1>
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Here's an overview of your account
                </p>
            </div>

            {/* Profile Card */}
            <div className={`mb-8 p-6 rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-md border border-gray-600/50' : 'bg-gradient-to-r from-white/90 to-gray-50/90 backdrop-blur-md border border-gray-200/50'}`}>
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                    <img
                        src={user?.avatar || 'https://via.placeholder.com/120'}
                        alt="Profile"
                        className="w-24 h-24 object-cover rounded-full shadow-lg border-4 border-white/20"
                    />
                    <div className="text-center md:text-left flex-1">
                        <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {user?.username}
                        </h2>
                        <p className={`text-lg mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {user?.role} Account
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-700/50 text-gray-200' : 'bg-gray-100/50 text-gray-800'}`}>
                                <User className="w-4 h-4" />
                                <span className="font-semibold">{user?.role}</span>
                            </div>
                            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-700/50 text-gray-200' : 'bg-gray-100/50 text-gray-800'}`}>
                                <Calendar className="w-4 h-4" />
                                <span>Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <Link
                        to="/profile/settings"
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                            theme === 'dark'
                                ? 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/50'
                                : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300'
                        }`}
                    >
                        Edit Profile
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, index) => (
                    <Link
                        key={index}
                        to={card.link}
                        className={`group p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer ${
                            theme === 'dark'
                                ? 'bg-gradient-to-br from-gray-800/70 to-gray-700/70 backdrop-blur-md border border-gray-600/50 hover:border-gray-500/50'
                                : 'bg-white/90 backdrop-blur-md border border-gray-200/50 hover:border-gray-300/50'
                        }`}
                    >
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            <card.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {card.value}
                        </h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {card.title}
                        </p>
                    </Link>
                ))}
            </div>

            {/* Recent Activity */}
            <div className={`p-6 rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800/70 to-gray-700/70 backdrop-blur-md border border-gray-600/50' : 'bg-white/90 backdrop-blur-md border border-gray-200/50'}`}>
                <h3 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Recent Activity
                </h3>
                <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                        <div key={index} className={`flex items-center space-x-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50/50'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                activity.type === 'cv' ? 'bg-green-500' :
                                activity.type === 'product' ? 'bg-blue-500' :
                                'bg-purple-500'
                            }`}>
                                {activity.type === 'cv' && <FileText className="w-5 h-5 text-white" />}
                                {activity.type === 'product' && <Package className="w-5 h-5 text-white" />}
                                {activity.type === 'profile' && <User className="w-5 h-5 text-white" />}
                            </div>
                            <div className="flex-1">
                                <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {activity.action}
                                </p>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {new Date(activity.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}