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
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-xl animate-pulse">Loading CVs...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <h1 className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        CV Marketplace
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.isArray(cvs) && cvs.map((cv) => (
          <CVCard key={cv._id} cv={cv} />
        ))}
      </div>
    </div>
  );
};

export default CVMarketplace;