import React, { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { sendNewsletterSignup } from "../utils/emailService.js";
import { Mail, CheckCircle, AlertCircle, Send, Bell, Gift, TrendingUp } from 'lucide-react';

export default function Newsletter() {
    const { theme } = useContext(ThemeContext);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await sendNewsletterSignup(email);
        setStatus(result);
        setLoading(false);
        if (result.success) {
            setEmail("");
        }
    };

    const benefits = [
        {
            icon: Bell,
            title: "Latest Trends",
            description: "Get notified about the newest fashion trends and styles"
        },
        {
            icon: Gift,
            title: "Exclusive Deals",
            description: "Access to special discounts and limited-time offers"
        },
        {
            icon: TrendingUp,
            title: "Market Insights",
            description: "Stay updated with fashion industry news and insights"
        }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Newsletter Subscription
                </h1>
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Stay connected with the latest fashion trends and exclusive offers
                </p>
            </div>

            {/* Benefits Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {benefits.map((benefit, index) => (
                    <div
                        key={index}
                        className={`p-6 rounded-2xl shadow-2xl text-center ${
                            theme === 'dark'
                                ? 'bg-gradient-to-br from-gray-800/70 to-gray-700/70 backdrop-blur-md border border-gray-600/50'
                                : 'bg-white/90 backdrop-blur-md border border-gray-200/50'
                        }`}
                    >
                        <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                            theme === 'dark' ? 'bg-purple-600/20' : 'bg-purple-100'
                        }`}>
                            <benefit.icon className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                        </div>
                        <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {benefit.title}
                        </h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {benefit.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Newsletter Form */}
            <div className={`p-8 rounded-2xl shadow-2xl ${
                theme === 'dark'
                    ? 'bg-gradient-to-br from-gray-800/70 to-gray-700/70 backdrop-blur-md border border-gray-600/50'
                    : 'bg-white/90 backdrop-blur-md border border-gray-200/50'
            }`}>
                <div className="text-center mb-6">
                    <Mail className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                    <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Join Our Fashion Community
                    </h2>
                    <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Subscribe to receive weekly updates on fashion trends, exclusive deals, and style inspiration
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <div className="mb-6">
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                required
                                className={`w-full px-4 py-3 pl-12 rounded-lg border focus:ring-2 focus:ring-purple-500 transition ${
                                    theme === 'dark'
                                        ? 'bg-gray-700 text-gray-200 border-gray-600 focus:border-purple-500'
                                        : 'bg-gray-50 text-gray-900 border-gray-300 focus:border-purple-500'
                                }`}
                            />
                            <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Subscribing...</span>
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                <span>Subscribe Now</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Status Message */}
                {status && (
                    <div className={`mt-6 p-4 rounded-lg flex items-center space-x-3 ${
                        status.success
                            ? theme === 'dark' ? 'bg-green-600/20 border border-green-500/50' : 'bg-green-100/90 border border-green-300'
                            : theme === 'dark' ? 'bg-red-600/20 border border-red-500/50' : 'bg-red-100/90 border border-red-300'
                    }`}>
                        {status.success ? (
                            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                        )}
                        <p className={`font-semibold ${status.success ? 'text-green-700' : 'text-red-700'}`}>
                            {status.message}
                        </p>
                    </div>
                )}
            </div>

            {/* Additional Info */}
            <div className={`mt-8 p-6 rounded-2xl ${
                theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
            }`}>
                <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    What You'll Receive
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className={`space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Weekly fashion trend updates</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Exclusive discount codes</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Early access to new collections</span>
                        </li>
                    </ul>
                    <ul className={`space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Style inspiration and tips</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Behind-the-scenes content</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Community highlights</span>
                        </li>
                    </ul>
                </div>

                <div className={`mt-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-white/50'}`}>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <strong>Privacy Note:</strong> We respect your privacy and will never share your email address.
                        You can unsubscribe at any time using the link in our emails.
                    </p>
                </div>
            </div>
        </div>
    );
}