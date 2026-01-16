import React, { useState, useContext } from 'react';
import { sendContactEmail } from '../utils/emailService';
import { ThemeContext } from '../context/ThemeContext';

const Contact = () => {
  const { theme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await sendContactEmail(formData);
    setStatus(result);
    setLoading(false);

    if (result.success) {
      setFormData({ name: '', email: '', message: '' });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-md mx-auto">
        <img src="/splash.png" alt="ReStyle Logo" className="w-20 h-20 mx-auto mb-4 object-contain" />
        <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`mt-1 block w-full px-3 py-2 border ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Your Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`mt-1 block w-full px-3 py-2 border ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium">
              Your Message
            </label>
            <textarea
              name="message"
              id="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              className={`mt-1 block w-full px-3 py-2 border ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
          {status && (
            <p className={`text-center text-sm ${status.success ? 'text-green-600' : 'text-red-600'}`}>
              {status.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Contact;