import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { Ruler, Scale, Languages, Mail } from 'lucide-react';

const CVCard = ({ cv }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:rotate-0 sm:hover:rotate-1 overflow-hidden backdrop-blur-sm ${
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
      <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 sm:p-6 md:p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center space-x-3 sm:space-x-4 md:space-x-6">
          <div className="relative flex-shrink-0">
            <img
              src={cv.profileImage || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 sm:border-4 border-white/80 object-cover shadow-lg transition-transform duration-300 hover:scale-110"
            />
            <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-0.5 sm:mb-1 truncate">{cv.nationality}</h2>
            <p className="text-indigo-100 text-xs sm:text-sm font-medium">Professional CV</p>
          </div>
        </div>
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 opacity-20">
          <Mail className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
        </div>
      </div>

      {/* Body with glassmorphism */}
      <div className="p-3 sm:p-5 md:p-8 relative">
        <div
          className={`rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 backdrop-blur-md ${
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
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 group">
              <div className="p-1.5 sm:p-2 rounded-full bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors duration-300">
                <Ruler className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'} group-hover:scale-110 transition-transform duration-300`} />
              </div>
              <div className="text-center sm:text-left">
                <p className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Height</p>
                <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  {cv.height} cm
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 group">
              <div className="p-1.5 sm:p-2 rounded-full bg-green-500/20 group-hover:bg-green-500/30 transition-colors duration-300">
                <Scale className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${theme === 'dark' ? 'text-green-300' : 'text-green-600'} group-hover:scale-110 transition-transform duration-300`} />
              </div>
              <div className="text-center sm:text-left">
                <p className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Weight</p>
                <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  {cv.weight} kg
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 group">
              <div className="p-1.5 sm:p-2 rounded-full bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors duration-300">
                <Languages className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'} group-hover:scale-110 transition-transform duration-300`} />
              </div>
              <div className="text-center sm:text-left min-w-0">
                <p className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Languages</p>
                <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} line-clamp-2`}>
                  {cv.languages.join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-3 sm:mb-6">
            <h3 className={`text-sm sm:text-base md:text-lg font-semibold mb-1.5 sm:mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>About</h3>
            <p className={`text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {cv.description}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 sm:p-5 md:p-8 pt-0">
        <a
          href={`mailto:${cv.email}`}
          className="group relative block w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-center py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-medium sm:font-semibold text-sm sm:text-base overflow-hidden transition-all duration-300 transform hover:scale-[1.02] sm:hover:scale-105 hover:shadow-lg active:scale-[0.98]"
        >
          <span className="relative z-10 flex items-center justify-center space-x-1.5 sm:space-x-2">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Contact Me</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </a>
      </div>
    </div>
  );
};

export default CVCard;