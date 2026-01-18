import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { Shirt, Watch, ShoppingBag, Star, Users, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
    const { user } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    const heroImages = [
        '/splash.png',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
        'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'
    ];

    const categories = [
        { name: "Men's Fashion", icon: Shirt, path: '/explore?category=Men' },
        { name: "Women's Fashion", icon: Shirt, path: '/explore?category=Women' },
        { name: "Accessories", icon: Watch, path: '/explore?category=Accessories' },
        { name: "Bags", icon: ShoppingBag, path: '/explore?category=Bags' },
    ];

    const [stats, setStats] = useState([
        { label: "Happy Customers", value: "Loading...", icon: Users },
        { label: "Products Available", value: "Loading...", icon: Package },
        { label: "CV's Added", value: "Loading...", icon: Star },
    ]);

    // Fetch real stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, productsRes, cvsRes] = await Promise.all([
                    fetch("/api/stats/users").then(res => res.json()),
                    fetch("/api/stats/products").then(res => res.json()),
                    fetch("/api/stats/cvs").then(res => res.json())
                ]);

                setStats([
                    { label: "Happy Customers", value: usersRes.count || "0", icon: Users },
                    { label: "Products Available", value: productsRes.count || "0", icon: Package },
                    { label: "CV's Added", value: cvsRes.count || "0", icon: Star },
                ]);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
                // Keep loading text or set defaults
                setStats([
                    { label: "Happy Customers", value: "10,000+", icon: Users },
                    { label: "Products Available", value: "5,000+", icon: Package },
                    { label: "CV's Added", value: "1,000+", icon: Star },
                ]);
            }
        };

        fetchStats();
    }, []);

    const testimonials = [
        { name: "Anna K.", text: "Found amazing deals on ReStyle! Love the quality and variety.", rating: 5 },
        { name: "Mike T.", text: "Great platform for second-hand fashion. Sustainable and stylish!", rating: 5 },
        { name: "Sara L.", text: "Easy to use, fast shipping. Highly recommend!", rating: 5 },
    ];

    // Fetch featured products
    useEffect(() => {
        fetch("https://restyle-backend123.vercel.app/api/products")
            .then((res) => res.json())
            .then((data) => {
                // Sort by likes and take top 6
                const sorted = data.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
                setFeaturedProducts(sorted.slice(0, 6));
            })
            .catch((err) => console.error("Failed to load featured products:", err));
    }, []);

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

    // Auto-slide carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroImages.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);

    return (
        <div className="w-full">
            {/* Hero Carousel */}
            <div className="relative h-[500px] md:h-[700px] overflow-hidden">
                {heroImages.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${img})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
                    </div>
                ))}

                {/* Carousel Controls */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/30 transition-all"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/30 transition-all"
                >
                    <ChevronRight className="w-6 h-6 text-white" />
                </button>

                {/* Hero Content */}
                <div className="relative z-10 flex items-center justify-center h-full px-6 md:px-20">
                    <div className="text-center text-white max-w-4xl">
                        <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in-up">
                            ReStyle
                        </h1>
                        <p className="text-xl md:text-3xl font-light mb-8 animate-fade-in-up animation-delay-200">
                            Where fashion meets savings. Discover unique pieces, sustainable style.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
                            {user ? (
                                <button
                                    onClick={() => navigate('/explore')}
                                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 transform"
                                >
                                    🌍 Explore Now →
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/log-in')}
                                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xl font-bold rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 transform"
                                >
                                    🔐 Join the Style Revolution
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${
                                index === currentSlide ? 'bg-white' : 'bg-white/50'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Categories Section */}
            <div className={`py-16 px-6 md:px-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <h2 className={`text-4xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Shop by Category
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((cat, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(cat.path)}
                            className={`group p-8 rounded-3xl cursor-pointer transition-all duration-500 hover:scale-105 transform ${
                                theme === 'dark'
                                    ? 'bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800'
                                    : 'bg-white/80 border border-gray-200 hover:bg-white'
                            } backdrop-blur-sm shadow-lg hover:shadow-2xl`}
                        >
                            <cat.icon className={`w-12 h-12 mx-auto mb-4 transition-colors ${
                                theme === 'dark' ? 'text-gray-300 group-hover:text-purple-400' : 'text-gray-600 group-hover:text-purple-600'
                            }`} />
                            <h3 className={`text-xl font-semibold text-center ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                                {cat.name}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured Products */}
            <div className={`py-16 px-6 md:px-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-4xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Featured Products
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredProducts.slice(0, 6).map((product) => (
                        <ProductCard
                            key={product._id}
                            p={product}
                            onToggleFavProp={() => {}}
                            isFav={false}
                            cart={[]}
                            addToCart={() => {}}
                            removeFromCart={() => {}}
                        />
                    ))}
                </div>
                <div className="text-center mt-12">
                    <button
                        onClick={() => navigate('/explore')}
                        className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                            theme === 'dark'
                                ? 'bg-gray-700 text-white hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                    >
                        View All Products →
                    </button>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-16 px-6 md:px-20 bg-gradient-to-r from-purple-600 to-pink-600">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <stat.icon className="w-12 h-12 mb-4" />
                            <div className="text-4xl font-bold mb-2">{stat.value}</div>
                            <div className="text-xl">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonials */}
            <div className={`py-16 px-6 md:px-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <h2 className={`text-4xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    What Our Customers Say
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className={`p-8 rounded-3xl ${
                                theme === 'dark'
                                    ? 'bg-gray-800/50 border border-gray-700/50'
                                    : 'bg-white/80 border border-gray-200'
                            } backdrop-blur-sm shadow-lg`}
                        >
                            <div className="flex mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                ))}
                            </div>
                            <p className={`text-lg mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                "{testimonial.text}"
                            </p>
                            <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                - {testimonial.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className={`py-16 px-6 md:px-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="text-center">
                    <h2 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Ready to Style Your Life?
                    </h2>
                    <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Join thousands of fashion enthusiasts discovering their perfect look.
                    </p>
                    {user ? (
                        <button
                            onClick={() => navigate('/explore')}
                            className="px-12 py-6 bg-gradient-to-r from-green-500 to-teal-500 text-white text-2xl font-bold rounded-2xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 transform"
                        >
                            Start Shopping Now →
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/sign-up')}
                            className="px-12 py-6 bg-gradient-to-r from-orange-500 to-red-500 text-white text-2xl font-bold rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 transform"
                        >
                            Create Your Account
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
