import React, { useState, useEffect, useContext } from "react";
import ProductCard from "../components/ProductCard";
import Filters from "../components/Filters";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";

export default function Explore({ products, favorites, toggleFav, cart, addToCart, removeFromCart }) {
    const { user } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const [query, setQuery] = useState("");
    const [filters, setFilters] = useState({});
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOption, setSortOption] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    const toggleSortOrder = () => setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));

    const handleDelete = async (productId) => {
        try {
            const url = user?.role === "admin" ? `${import.meta.env.VITE_API_BASE_PROD}/api/products/admin/${productId}` : `${import.meta.env.VITE_API_BASE_PROD}/api/products/${productId}`;
            await axios.delete(url);
            setProducts(products.filter((product) => product._id !== productId));
            alert("Product deleted successfully");
        } catch (err) {
            console.error("Failed to delete product:", err.message);
            alert("Failed to delete product");
        }
    };

    const filtered = products.filter((p) => {
        const matchesQuery = query ? p.name?.toLowerCase().includes(query.toLowerCase()) : true;
        const matchesCategory = !filters.category || p.category === filters.category;
        const matchesColor = !filters.color || (p.colors && p.colors.includes(filters.color));
        const matchesSize = !filters.size || (p.sizes && p.sizes.includes(filters.size));
        const matchesPrice = !filters.maxPrice || p.price <= parseInt(filters.maxPrice);
        return matchesQuery && matchesCategory && matchesColor && matchesSize && matchesPrice;
    });

    const sorted = [...filtered].sort((a, b) => {
        if (!sortOption) return 0;
        return sortOrder === "asc" ? a[sortOption] - b[sortOption] : b[sortOption] - a[sortOption];
    });

    // Pagination
    const totalPages = Math.ceil(sorted.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const paginatedProducts = sorted.slice(startIndex, startIndex + productsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 mx-1 rounded ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-500 hover:text-white transition`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="w-full">
            {/* Search & Sort */}
            <div className="flex flex-wrap justify-center items-center gap-3 my-6 px-4 md:px-20">
                <input
                    type="text"
                    placeholder="Search items..."
                    className={`border border-gray-300 dark:border-gray-600 p-2 rounded w-full md:w-1/2 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    className={`px-4 py-2 ${
                        theme === 'dark'
                            ? "bg-gray-900 text-white hover:bg-gray-700"
                            : "bg-white text-gray-900 hover:bg-gray-700"
                    } rounded`}
                    onClick={() => setFilterOpen(true)}
                >
                    Filters
                </button>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className={`border-none p-2 rounded-l outline-none ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
                    >
                        <option value="">Sort by</option>
                        <option value="price">Price</option>
                    </select>
                    <button
                        onClick={toggleSortOrder}
                        className={`px-3 py-2 ${theme === 'dark' ? 'bg-gray-900 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-200'} rounded-r transition`}
                        title={sortOrder === "asc" ? "Ascending" : "Descending"}
                    >
                        {sortOrder === "asc" ? "↑" : "↓"}
                    </button>
                </div>
            </div>

            {/* Filters Modal */}
            {filterOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-11/12 md:w-1/3 relative">
                        <button
                            onClick={() => setFilterOpen(false)}
                            className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 font-bold"
                        >
                            ×
                        </button>
                        <Filters
                            filters={filters}
                            setFilters={setFilters}
                            close={() => setFilterOpen(false)}
                        />
                    </div>
                </div>
            )}

            {/* Products Grid */}
            <div className="p-4">
                <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-200">Explore Products</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {paginatedProducts.map((p) => (
                        <ProductCard
                            key={p._id}
                            p={p}
                            onToggleFavProp={toggleFav}
                            isFav={favorites.includes(p._id)}
                            cart={cart}
                            addToCart={addToCart}
                            removeFromCart={removeFromCart}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex flex-col items-center mt-8">
                        <div className="mb-4 text-gray-700 dark:text-gray-300">
                            Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex justify-center items-center">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition"
                            >
                                Previous
                            </button>
                            {renderPageNumbers()}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}