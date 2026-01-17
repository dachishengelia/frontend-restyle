import React from 'react'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-8 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          &copy; {new Date().getFullYear()} ReStyle. All rights reserved.
        </div>
        <div className="flex gap-4">
          <a href="https://facebook.com" target="_blank"><FaFacebook size={24} /></a>
          <a href="https://www.instagram.com/resty_leofficial?igsh=eGEzdW83bnNhYW5s&utm_source=qr" target="_blank"><FaInstagram size={24} /></a>
          <a href="https://x.com/re_styleofff?s=11" target="_blank"><FaTwitter size={24} /></a>
        </div>
        <div>
          📞 +995 599 123 456 | ✉️ ReStyle@gmail.com
        </div>
      </div>
    </footer>
  )
}

