import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";

export default function Home() {
    const { user } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const brands = ["Zara", "H&M", "New Yorker", "Waikiki", "Mango", "Nike", "Adidas", "Uniqlo", "Puma", "Levis", "Gucci", "Prada", "Versace", "Armani"];

    // Check for payment status in URL params
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const payment = urlParams.get('payment');
        if (payment === 'success') {
            toast.success('Payment successful', {
                icon: '✔',
                autoClose: 4000,
            });
        } else if (payment === 'cancel') {
            toast.error('Payment canceled', {
                icon: '✖',
                autoClose: 4000,
            });
        }
        // Clear the query param
        if (payment) {
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, []);

    return (
        <div className="w-full">
            {/* Splash Section */}
            <div className="flex flex-col md:flex-row items-center justify-between
                            bg-gradient-to-r from-indigo-600 to-purple-600 text-white h-[500px] md:h-[600px] px-6 md:px-20
                            relative overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: "url('/splash.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        opacity: 0.8,
                    }}
                ></div>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 md:w-1/2 mt-6 md:mt-0 md:ml-12">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">ReStyle</h1>
                    <p className="text-xl md:text-2xl font-medium">
                        "Where fashion meets savings."
                    </p>
                </div>
            </div>

            {/* Brands Marquee */}
            <div className={`overflow-hidden py-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} relative`}>
                <div className="flex gap-8 whitespace-nowrap animate-marquee-fast">
                    {brands.concat(brands).map((b, i) => (
                        <div
                            key={i}
                            className={`px-6 py-3 ${theme === 'dark' ? 'bg-gray-900 text-white border border-gray-700' : 'bg-white text-gray-900'} shadow rounded-full font-bold flex-shrink-0
                                        transform transition-transform duration-300 hover:scale-140`}
                        >
                            {b}
                        </div>
                    ))}
                </div>
            </div>

            {/* Explore Button */}
            <div className="flex justify-center py-12">
                {user ? (
                    <button
                        onClick={() => navigate('/explore')}
                        className="px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-110 transform"
                    >
                        🌍 Explore Marketplace →
                    </button>
                ) : (
                    <button
                        onClick={() => navigate('/log-in')}
                        className="px-12 py-6 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-2xl font-bold rounded-2xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-110 transform"
                    >
                        🔐 Log in to explore.
                    </button>
                )}
            </div>
        </div>
    );
}
