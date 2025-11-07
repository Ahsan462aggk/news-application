import React from 'react';
import { Rss, Twitter, Facebook } from 'lucide-react';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a1d29] text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          {/* NBC Logo */}
          <div className="flex items-center mb-4 md:mb-0">
            <div className="flex items-center">
              {/* NBC Peacock Logo placeholder */}
              <svg className="w-10 h-10 mr-3" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" fill="white"/>
                <path d="M20 8 L14 14 L20 20 L26 14 Z" fill="#f59e0b"/>
                <path d="M14 14 L8 20 L14 26 L20 20 Z" fill="#ef4444"/>
                <path d="M26 14 L32 20 L26 26 L20 20 Z" fill="#3b82f6"/>
                <path d="M20 20 L14 26 L20 32 L26 26 Z" fill="#10b981"/>
              </svg>
            </div>
          </div>
          
          {/* Social Icons */}
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Rss className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="currentColor"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        {/* Footer Links */}
        <div className="flex flex-col md:flex-row justify-between items-start border-t border-gray-700 pt-6">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-400 mb-2">&copy; 2020 | NBC NEWS</p>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Privacy Policy
            </a>
            <span className="text-gray-600 mx-2">|</span>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Do not sell my personal info
            </a>
            <span className="text-gray-600 mx-2">|</span>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Terms of Service
            </a>
            <span className="text-gray-600 mx-2">|</span>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              nbcnews.com Site Map
            </a>
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Coupons</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
