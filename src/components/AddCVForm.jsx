import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import { ThemeContext } from '../context/ThemeContext.jsx';

const AddCVForm = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    nationality: '',
    languages: [],
    instagram: '',
    email: '',
    profileImage: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLanguagesChange = (e) => {
    const languages = e.target.value.split(',').map(lang => lang.trim()).filter(lang => lang);
    setFormData(prev => ({
      ...prev,
      languages
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataImg = new FormData();
    formDataImg.append('image', file);

    setImageUploading(true);
    try {
      const response = await axios.post('/api/cv/upload', formDataImg, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({
        ...prev,
        profileImage: response.data.imageUrl
      }));
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmitCV = async () => {
    // Validate form
    if (!formData.height || !formData.weight || !formData.nationality || !formData.languages.length || !formData.email) {
      alert('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        '/api/cv/checkout',
        formData,
        { withCredentials: true }
      );
      alert(response.data.message);
      navigate('/cv-marketplace');
    } catch (error) {
      alert('CV submission failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className={`max-w-4xl w-full p-8 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700`}>
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Add Your CV</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="md:col-span-2 flex flex-col items-center">
            <label className={`block text-lg font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-4`}>Your Profile Image:</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={imageUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className={`w-32 h-32 rounded-full border-4 border-dashed ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} flex items-center justify-center hover:border-blue-500 transition-colors`}>
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className={`text-4xl ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>+</span>
                )}
              </div>
            </div>
            {imageUploading && <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-2`}>Uploading...</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Height (cm):</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 border-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-gray-50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              placeholder="e.g., 175"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Weight (kg):</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 border-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-gray-50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              placeholder="e.g., 70"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Nationality:</label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 border-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-gray-50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              placeholder="e.g., American"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Languages (comma-separated):</label>
            <input
              type="text"
              placeholder="English, Spanish, French"
              value={formData.languages.join(', ')}
              onChange={handleLanguagesChange}
              required
              className={`w-full px-4 py-3 border-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-gray-50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 border-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-gray-50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Instagram (optional):</label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleInputChange}
              placeholder="@username"
              className={`w-full px-4 py-3 border-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-gray-50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
          </div>
        </div>

        <div className="mb-8">
          <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Shortly describe yourself:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Tell us a bit about yourself..."
            rows="5"
            className={`w-full px-4 py-3 border-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-gray-50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
          />
        </div>

        <button
          type="button"
          onClick={handleSubmitCV}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg transition-all transform hover:scale-105"
        >
          {loading ? 'Submitting...' : 'Submit CV'}
        </button>
      </div>
    </div>
  );
};

export default AddCVForm;