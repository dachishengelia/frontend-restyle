import React, { useContext } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { User, Settings, Package, FileText, Mail, LogOut, Home } from 'lucide-react';

export default function ProfileLayout() {
    const { user, signOut } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const location = useLocation();

    const menuItems = [
        { path: "/profile", label: "Overview", icon: User },
        { path: "/profile/settings", label: "Account Settings", icon: Settings },
        { path: "/profile/newsletter", label: "Newsletter", icon: Mail },
    ];

    if (user?.role === "seller") {
        menuItems.splice(2, 0, { path: "/profile/products", label: "My Products", icon: Package });
    }

    menuItems.push({ path: "/profile/cvs", label: "My CVs", icon: FileText });

    const handleSignOut = () => {
        if (window.confirm("Are you sure you want to sign out?")) {
            signOut();
        }
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
            <div className="flex">
                {/* Sidebar */}
                <div className={`w-64 min-h-screen ${theme === 'dark' ? 'bg-gray-800/90 backdrop-blur-md border-r border-gray-700/50' : 'bg-white/90 backdrop-blur-md border-r border-gray-200/50'} shadow-xl`}>
                    <div className="p-6">
                        <Link to="/" className="flex items-center space-x-2 mb-8">
                            <Home className="w-6 h-6" />
                            <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ReStyle</span>
                        </Link>

                        <div className="flex flex-col items-center mb-8">
                            <img
                                src={user?.avatar || 'https://via.placeholder.com/80'}
                                alt="Profile"
                                className="w-20 h-20 object-cover rounded-full shadow-lg border-4 border-white/20 mb-4"
                            />
                            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {user?.username}
                            </h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {user?.role}
                            </p>
                        </div>

                        <nav className="space-y-2">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                                        location.pathname === item.path
                                            ? theme === 'dark'
                                                ? 'bg-purple-600/20 text-purple-300 border-l-4 border-purple-500'
                                                : 'bg-purple-100 text-purple-700 border-l-4 border-purple-500'
                                            : theme === 'dark'
                                                ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-8 pt-8 border-t border-gray-200/20">
                            <button
                                onClick={handleSignOut}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 w-full ${
                                    theme === 'dark'
                                        ? 'text-red-400 hover:bg-red-600/20 hover:text-red-300'
                                        : 'text-red-600 hover:bg-red-100 hover:text-red-700'
                                }`}
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}