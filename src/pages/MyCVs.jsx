import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "../axios.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { toast } from "react-toastify";
import { FileText, Plus, Edit, Trash2, Eye, User, MapPin, Phone, Mail } from 'lucide-react';

export default function MyCVs() {
    const { user } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const [cvs, setCvs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCVs();
    }, []);

    const fetchCVs = async () => {
        try {
            const res = await axios.get("/api/cv/user");
            setCvs(res.data.cvs || []);
        } catch (err) {
            console.error("Failed to fetch CVs:", err);
            toast.error("Failed to load CVs");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (cvId) => {
        if (!window.confirm("Are you sure you want to delete this CV?")) return;

        try {
            await axios.delete(`/api/cv/${cvId}`);
            setCvs(cvs.filter(cv => cv._id !== cvId));
            toast.success("CV deleted successfully");
        } catch (err) {
            console.error("Failed to delete CV:", err);
            toast.error("Failed to delete CV");
        }
    };

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
                    My CVs
                </h1>
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Manage your CV profiles and track opportunities
                </p>
            </div>

            {/* Add CV Button */}
            <div className="mb-8">
                <Link
                    to="/add-cv"
                    className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        theme === 'dark'
                            ? 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/50'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300'
                    }`}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New CV
                </Link>
            </div>

            {/* CVs Grid */}
            {cvs.length === 0 ? (
                <div className={`text-center py-12 px-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <FileText className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                    <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        No CVs yet
                    </h3>
                    <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Create your first CV to showcase your profile
                    </p>
                    <Link
                        to="/add-cv"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Your First CV
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cvs.map((cv) => (
                        <div
                            key={cv._id}
                            className={`rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] overflow-hidden ${
                                theme === 'dark'
                                    ? 'bg-gradient-to-br from-gray-800/70 to-gray-700/70 backdrop-blur-md border border-gray-600/50'
                                    : 'bg-white/90 backdrop-blur-md border border-gray-200/50'
                            }`}
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={cv.profileImage || 'https://via.placeholder.com/80'}
                                            alt="Profile"
                                            className="w-16 h-16 object-cover rounded-full border-2 border-white/20"
                                        />
                                        <div>
                                            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {cv.nationality}
                                            </h3>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {cv.height}cm • {cv.weight}kg
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2">
                                        <Link
                                            to={`/edit-cv/${cv._id}`}
                                            className={`p-2 rounded-lg transition-colors ${
                                                theme === 'dark'
                                                    ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/20'
                                                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-100'
                                            }`}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(cv._id)}
                                            className={`p-2 rounded-lg transition-colors ${
                                                theme === 'dark'
                                                    ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/20'
                                                    : 'text-gray-600 hover:text-red-600 hover:bg-red-100'
                                            }`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Languages: {cv.languages?.join(', ') || 'Not specified'}
                                        </span>
                                    </div>

                                    {cv.description && (
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} line-clamp-3`}>
                                            {cv.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex space-x-2">
                                    <Link
                                        to={`/cv/${cv._id}`}
                                        className={`flex-1 py-2 px-4 rounded-lg text-center font-semibold transition-all duration-300 ${
                                            theme === 'dark'
                                                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        View Details
                                    </Link>
                                    <Link
                                        to={`/edit-cv/${cv._id}`}
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