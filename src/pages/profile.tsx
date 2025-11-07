import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { User } from 'lucide-react';

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>User Profile | NBC News</title>
        <meta name="description" content="User profile page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow py-6 md:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={48} className="text-gray-500" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-6">User Profile</h1>
            
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-lg font-medium mb-2">Personal Information</h2>
                <p className="text-gray-600">Name: John Doe</p>
                <p className="text-gray-600">Email: john.doe@example.com</p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-lg font-medium mb-2">Subscription</h2>
                <p className="text-gray-600">Status: Active</p>
                <p className="text-gray-600">Plan: Basic</p>
              </div>
              
              <div>
                <h2 className="text-lg font-medium mb-2">Preferences</h2>
                <p className="text-gray-600">Notifications: Enabled</p>
                <p className="text-gray-600">Newsletter: Subscribed</p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
