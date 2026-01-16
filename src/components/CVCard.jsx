import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { Ruler, Scale, Languages, Mail } from 'lucide-react';

const CVCard = ({ cv }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1 overflow-hidden backdrop-blur-sm ${
        theme === 'dark'
          ? 'bg-gray-800/80 border border-gray-600/50'
          : 'bg-white/90 border border-gray-200/50'
      }`}
      style={{
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      {/* Header with enhanced gradient and profile */}
      <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center space-x-6">
          <div className="relative">
            <img
              src={cv.profileImage || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white/80 object-cover shadow-lg transition-transform duration-300 hover:scale-110"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">{cv.nationality}</h2>
            <p className="text-indigo-100 text-sm font-medium">Professional CV</p>
          </div>
        </div>
        <div className="absolute top-4 right-4 opacity-20">
          <Mail className="w-8 h-8" />
        </div>
      </div>

      {/* Body with glassmorphism */}
      <div className="p-8 relative">
        <div
          className={`rounded-xl p-6 backdrop-blur-md ${
            theme === 'dark'
              ? 'bg-gray-700/30 border border-gray-600/30'
              : 'bg-gray-100/50 border border-gray-200/30'
          }`}
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center space-x-3 group">
              <div className="p-2 rounded-full bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors duration-300">
                <Ruler className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'} group-hover:scale-110 transition-transform duration-300`} />
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Height</p>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  {cv.height} cm
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3 group">
              <div className="p-2 rounded-full bg-green-500/20 group-hover:bg-green-500/30 transition-colors duration-300">
                <Scale className={`w-6 h-6 ${theme === 'dark' ? 'text-green-300' : 'text-green-600'} group-hover:scale-110 transition-transform duration-300`} />
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Weight</p>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  {cv.weight} kg
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3 group">
              <div className="p-2 rounded-full bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors duration-300">
                <Languages className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'} group-hover:scale-110 transition-transform duration-300`} />
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Languages</p>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  {cv.languages.join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>About</h3>
            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {cv.description}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-8 pt-0">
        <a
          href={`mailto:${cv.email}`}
          className="group relative block w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-center py-4 rounded-xl font-semibold overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          <span className="relative z-10 flex items-center justify-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Contact Me</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </a>
      </div>
    </div>
  );
};

export default CVCard;