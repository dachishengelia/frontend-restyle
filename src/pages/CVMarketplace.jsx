import React, { useState, useEffect, useContext } from 'react';
import axios from '../axios';
import { ThemeContext } from '../context/ThemeContext.jsx';
import CVCard from '../components/CVCard.jsx';

const CVMarketplace = () => {
  const { theme } = useContext(ThemeContext);
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const response = await axios.get('/api/cv/marketplace');
        console.log('CV Marketplace response:', response.data);
        if (response.data && Array.isArray(response.data.cvs)) {
          setCvs(response.data.cvs);
        } else {
          console.error('CV data is not an array:', response.data);
          setCvs([]);
        }
      } catch (error) {
        console.error('Failed to fetch CVs:', error);
        setCvs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCVs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <p className="text-gray-300 text-xl animate-pulse">Loading CVs...</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-4 py-8 sm:p-8 transition-all duration-500 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
      }`}
    >
      {/* HEADER */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-10 tracking-tight">
        🌟 CV Marketplace
      </h1>

      {/* GRID CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {Array.isArray(cvs) && cvs.length > 0 ? (
          cvs.map((cv) => (
            <div
              key={cv._id}
              className={`rounded-xl p-5 transform hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-2xl ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                  : 'bg-white hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <CVCard cv={cv} />
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 text-lg">
            No CVs found at the moment. Try again later.
          </p>
        )}
      </div>
    </div>
  );
};

export default CVMarketplace;