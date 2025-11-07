import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

const MenuPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>Menu | NBC News</title>
        <meta name="description" content="Menu page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow py-6 md:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Menu</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">News Categories</h2>
                <ul className="space-y-3">
                  <li><Link href="/corona-updates" className="text-gray-700 hover:text-blue-600">Corona Updates</Link></li>
                  <li><Link href="/politics" className="text-gray-700 hover:text-blue-600">Politics</Link></li>
                  <li><Link href="/business" className="text-gray-700 hover:text-blue-600">Business</Link></li>
                  <li><Link href="/sports" className="text-gray-700 hover:text-blue-600">Sports</Link></li>
                  <li><Link href="/world" className="text-gray-700 hover:text-blue-600">World</Link></li>
                  <li><Link href="/travel" className="text-gray-700 hover:text-blue-600">Travel</Link></li>
                  <li><Link href="/podcasts" className="text-gray-700 hover:text-blue-600">Podcasts</Link></li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">User</h2>
                <ul className="space-y-3">
                  <li><Link href="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link></li>
                  <li><Link href="/bookmarks" className="text-gray-700 hover:text-blue-600">Bookmarks</Link></li>
                  <li><Link href="/settings" className="text-gray-700 hover:text-blue-600">Settings</Link></li>
                </ul>
                
                <h2 className="text-xl font-semibold mb-4 mt-8 border-b border-gray-200 pb-2">About</h2>
                <ul className="space-y-3">
                  <li><Link href="/about" className="text-gray-700 hover:text-blue-600">About Us</Link></li>
                  <li><Link href="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link></li>
                  <li><Link href="/careers" className="text-gray-700 hover:text-blue-600">Careers</Link></li>
                  <li><Link href="/privacy" className="text-gray-700 hover:text-blue-600">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-gray-700 hover:text-blue-600">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MenuPage;
