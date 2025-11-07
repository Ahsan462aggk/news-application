import React, { useEffect, useState } from 'react';
import { Search, User, Menu } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header: React.FC = () => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 2);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b border-gray-200 ${
        scrolled ? 'shadow-sm' : ''
      }`}
      style={{ fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial, sans-serif' }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* NBC Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
            <svg className="w-28 h-10" viewBox="0 0 120 40" fill="none" aria-label="NBC News">
              {/* Peacock logo */}
              <circle cx="20" cy="20" r="18" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
              <path d="M20 8 L14 14 L20 20 L26 14 Z" fill="#f59e0b"/>
              <path d="M14 14 L8 20 L14 26 L20 20 Z" fill="#ef4444"/>
              <path d="M26 14 L32 20 L26 26 L20 20 Z" fill="#3b82f6"/>
              <path d="M20 20 L14 26 L20 32 L26 26 Z" fill="#10b981"/>
              {/* NBC NEWS text */}
              <text x="45" y="25" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#111827">
                NBC NEWS
              </text>
            </svg>
          </div>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-[12px] tracking-wide uppercase text-[#222]">
            <Link href="/category/coronavirus-updates" className="hover:text-black transition-colors flex items-center">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-2" />
              Coronavirus Updates
            </Link>
            <Link href="/category/politics" className="hover:text-black transition-colors">Politics</Link>
            <Link href="/category/business" className="hover:text-black transition-colors">Business</Link>
            <Link href="/category/sports" className="hover:text-black transition-colors">Sports</Link>
            <Link href="/category/world" className="hover:text-black transition-colors">World</Link>
            <Link href="/category/travel" className="hover:text-black transition-colors">Travel</Link>
            <Link href="/category/podcasts" className="hover:text-black transition-colors">Podcasts</Link>
          </nav>
          
          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            <button 
              className="text-gray-600 hover:text-black transition-colors" 
              onClick={() => router.push('/profile')}
              aria-label="User profile"
            >
              <User size={20} />
            </button>
            <button 
              className="text-gray-600 hover:text-black transition-colors" 
              onClick={() => router.push('/search')}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button 
              className="text-gray-600 hover:text-black transition-colors" 
              onClick={() => router.push('/menu')}
              aria-label="Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;