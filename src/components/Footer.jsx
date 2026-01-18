import React, { useState } from 'react'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'
import RatingModal from './RatingModal.jsx'

export default function Footer() {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-gray-900 text-white py-4 sm:py-6 mt-8 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          {/* Copyright */}
          <div className="text-xs sm:text-sm md:text-base text-center md:text-left order-3 md:order-1">
            &copy; {new Date().getFullYear()} ReStyle. All rights reserved.
          </div>

          {/* Social Icons and Rate Button */}
          <div className="flex gap-5 sm:gap-4 order-1 md:order-2 items-center">
            <button
              onClick={() => setIsRatingModalOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              ⭐ Rate our website
            </button>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors p-2 -m-2"
              aria-label="Facebook"
            >
              <FaFacebook className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a
              href="https://www.instagram.com/resty_leofficial?igsh=eGEzdW83bnNhYW5s&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 transition-colors p-2 -m-2"
              aria-label="Instagram"
            >
              <FaInstagram className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a
              href="https://x.com/re_styleofff?s=11"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 transition-colors p-2 -m-2"
              aria-label="Twitter"
            >
              <FaTwitter className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          </div>

          {/* Contact Info */}
          <div className="text-xs sm:text-sm md:text-base text-center md:text-right order-2 md:order-3 flex flex-col sm:flex-row gap-1 sm:gap-0">
            <span>📞 +995 599 123 456</span>
            <span className="hidden sm:inline"> | </span>
            <span>✉️ ReStyle@gmail.com</span>
          </div>
        </div>
      </footer>
      <RatingModal isOpen={isRatingModalOpen} onClose={() => setIsRatingModalOpen(false)} />
    </>
  )
}

