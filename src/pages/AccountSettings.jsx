import React, { useState, useContext, useEffect } from "react";
import axios from "../axios.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { toast } from "react-toastify";
import { User, Lock, Mail, Shield, Camera, Save, AlertTriangle } from 'lucide-react';

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export default function AccountSettings() {
    const { user, logIn, signOut } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);

    const [form, setForm] = useState({
        username: user?.username || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [imageUrl, setImageUrl] = useState(user?.avatar || "");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(user?.role || "buyer");
    const [rolePassword, setRolePassword] = useState("");

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    // Image Upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            setLoading(true);
            const res = await axios.patch("/users/update-avatar", formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            logIn(res.data.user);
            setImageUrl(res.data.user.avatar);
            toast.success("Avatar updated successfully");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to upload avatar");
        } finally {
            setLoading(false);
        }
    };

    // Username Update
    const handleUsernameSubmit = async (e) => {
        e.preventDefault();
        if (!form.currentPassword) {
            setMessage("Current password is required to change username.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.patch("/users/update", {
                username: form.username,
                currentPassword: form.currentPassword
            }, { withCredentials: true });

            logIn(res.data.user);
            if (res.data.token) setCookie("token", res.data.token, 1);
            setMessage("Username updated successfully.");
            setForm({ ...form, currentPassword: "" });
            toast.success("Username updated successfully");
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || "Failed to update username.");
            toast.error("Failed to update username");
        } finally {
            setLoading(false);
        }
    };

    // Password Update
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) {
            setMessage("New passwords do not match.");
            return;
        }
        if (!form.currentPassword) {
            setMessage("Current password is required.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.patch("/users/update-password", {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword
            }, { withCredentials: true });

            toast.success("Password updated successfully");
            setForm({ ...form, currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    // Role Change
    const handleRoleChangeSubmit = async (e) => {
        e.preventDefault();
        if (!rolePassword) {
            setMessage("Password is required to change role.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.patch("/api/profile/me/role", {
                newRole: selectedRole,
                email: user.email,
                password: rolePassword
            });

            logIn(res.data.user);
            setMessage("Role updated successfully.");
            setRolePassword("");
            toast.success("Role updated successfully");
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to update role.");
            toast.error("Failed to update role");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Account Settings
                </h1>
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Manage your account information and preferences
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Picture */}
                <div className={`p-8 rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800/70 to-gray-700/70 backdrop-blur-md border border-gray-600/50' : 'bg-white/90 backdrop-blur-md border border-gray-200/50'}`}>
                    <div className="flex items-center mb-6">
                        <Camera className="w-6 h-6 mr-3 text-purple-500" />
                        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Profile Picture
                        </h2>
                    </div>

                    <div className="flex flex-col items-center">
                        <img
                            src={imageUrl || 'https://via.placeholder.com/150'}
                            alt="Profile Preview"
                            className="w-32 h-32 object-cover rounded-full shadow-lg border-4 border-white/20 mb-6"
                        />
                        <label className={`cursor-pointer px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                            theme === 'dark'
                                ? 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/50'
                                : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300'
                        }`}>
                            <input
                                type="file"
                                onChange={handleImageUpload}
                                className="hidden"
                                accept="image/*"
                            />
                            {loading ? 'Uploading...' : 'Change Picture'}
                        </label>
                    </div>
                </div>

                {/* Username Update */}
                <div className={`p-8 rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800/70 to-gray-700/70 backdrop-blur-md border border-gray-600/50' : 'bg-white/90 backdrop-blur-md border border-gray-200/50'}`}>
                    <div className="flex items-center mb-6">
                        <User className="w-6 h-6 mr-3 text-blue-500" />
                        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Username
                        </h2>
                    </div>

                    <form onSubmit={handleUsernameSubmit} className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                New Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Enter new username"
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 transition ${
                                    theme === 'dark'
                                        ? 'bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500'
                                        : 'bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500'
                                }`}
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Current Password
                            </label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={form.currentPassword}
                                onChange={handleChange}
                                placeholder="Enter current password"
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 transition ${
                                    theme === 'dark'
                                        ? 'bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500'
                                        : 'bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500'
                                }`}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                            <Save className="w-5 h-5" />
                            <span>{loading ? 'Updating...' : 'Update Username'}</span>
                        </button>
                    </form>
                </div>

                {/* Password Update */}
                <div className={`p-8 rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800/70 to-gray-700/70 backdrop-blur-md border border-gray-600/50' : 'bg-white/90 backdrop-blur-md border border-gray-200/50'}`}>
                    <div className="flex items-center mb-6">
                        <Lock className="w-6 h-6 mr-3 text-green-500" />
                        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Change Password
                        </h2>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Current Password
                            </label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={form.currentPassword}
                                onChange={handleChange}
                                placeholder="Enter current password"
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500 transition ${
                                    theme === 'dark'
                                        ? 'bg-gray-700 text-gray-200 border-gray-600 focus:border-green-500'
                                        : 'bg-gray-50 text-gray-900 border-gray-300 focus:border-green-500'
                                }`}
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                New Password
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                value={form.newPassword}
                                onChange={handleChange}
                                placeholder="Enter new password"
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500 transition ${
                                    theme === 'dark'
                                        ? 'bg-gray-700 text-gray-200 border-gray-600 focus:border-green-500'
                                        : 'bg-gray-50 text-gray-900 border-gray-300 focus:border-green-500'
                                }`}
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm new password"
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500 transition ${
                                    theme === 'dark'
                                        ? 'bg-gray-700 text-gray-200 border-gray-600 focus:border-green-500'
                                        : 'bg-gray-50 text-gray-900 border-gray-300 focus:border-green-500'
                                }`}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                            <Lock className="w-5 h-5" />
                            <span>{loading ? 'Updating...' : 'Update Password'}</span>
                        </button>
                    </form>
                </div>

                {/* Role Management */}
                <div className={`p-8 rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800/70 to-gray-700/70 backdrop-blur-md border border-gray-600/50' : 'bg-white/90 backdrop-blur-md border border-gray-200/50'}`}>
                    <div className="flex items-center mb-6">
                        <Shield className="w-6 h-6 mr-3 text-orange-500" />
                        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Account Role
                        </h2>
                    </div>

                    <div className={`mb-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/50'}`}>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Current Role: <span className="font-semibold text-purple-500">{user?.role}</span>
                        </p>
                    </div>

                    <form onSubmit={handleRoleChangeSubmit} className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Change Role
                            </label>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                disabled={user?.role === "admin"}
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-500 transition ${
                                    theme === 'dark'
                                        ? 'bg-gray-700 text-gray-200 border-gray-600 focus:border-orange-500'
                                        : 'bg-gray-50 text-gray-900 border-gray-300 focus:border-orange-500'
                                } ${user?.role === "admin" ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <option value="buyer">Buyer</option>
                                <option value="seller">Seller</option>
                            </select>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={rolePassword}
                                onChange={(e) => setRolePassword(e.target.value)}
                                placeholder="Enter your password"
                                disabled={user?.role === "admin"}
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-500 transition ${
                                    theme === 'dark'
                                        ? 'bg-gray-700 text-gray-200 border-gray-600 focus:border-orange-500'
                                        : 'bg-gray-50 text-gray-900 border-gray-300 focus:border-orange-500'
                                } ${user?.role === "admin" ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || user?.role === "admin"}
                            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                            <Shield className="w-5 h-5" />
                            <span>{loading ? 'Updating...' : 'Change Role'}</span>
                        </button>
                    </form>
                </div>
            </div>

            {/* Message Display */}
            {message && (
                <div className={`mt-8 p-6 rounded-2xl shadow-2xl ${
                    message.includes('success')
                        ? theme === 'dark' ? 'bg-green-600/20 border border-green-500/50' : 'bg-green-100/90 border border-green-300'
                        : theme === 'dark' ? 'bg-red-600/20 border border-red-500/50' : 'bg-red-100/90 border border-red-300'
                }`}>
                    <div className="flex items-center space-x-3">
                        <AlertTriangle className={`w-6 h-6 ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`} />
                        <p className={`font-semibold ${message.includes('success') ? 'text-green-700' : 'text-red-700'}`}>
                            {message}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}