import React, { useState } from 'react';
import NewsCard from './NewsCard';
import { UnifiedArticle } from '@/lib/adapters';

interface LatestStoriesProps {
  latestStories: UnifiedArticle[];
  opinionStories: UnifiedArticle[];
  healthStories: UnifiedArticle[];
  onOpenModal?: (news: any) => void;
}

const LatestStories: React.FC<LatestStoriesProps> = ({ 
  latestStories, 
  opinionStories, 
  healthStories,
  onOpenModal 
}) => {
  const [activeTab, setActiveTab] = useState<'latest' | 'opinion' | 'health'>('latest');
  
  const getCurrentStories = () => {
    switch (activeTab) {
      case 'latest':
        return latestStories;
      case 'opinion':
        return opinionStories;
      case 'health':
        return healthStories;
      default:
        return latestStories;
    }
  };
  
  const stories = getCurrentStories();
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="flex items-center border-b border-gray-200 mb-8">
        <button
          className={`px-6 py-3 font-semibold text-sm transition-colors relative ${
            activeTab === 'latest'
              ? 'text-black border-b-2 border-black'
              : 'text-gray-500 hover:text-black'
          }`}
          onClick={() => setActiveTab('latest')}
        >
          Latest Stories
        </button>
        <button
          className={`px-6 py-3 font-semibold text-sm transition-colors relative ${
            activeTab === 'opinion'
              ? 'text-black border-b-2 border-black'
              : 'text-gray-500 hover:text-black'
          }`}
          onClick={() => setActiveTab('opinion')}
        >
          Opinion
        </button>
        <button
          className={`px-6 py-3 font-semibold text-sm transition-colors relative ${
            activeTab === 'health'
              ? 'text-black border-b-2 border-black'
              : 'text-gray-500 hover:text-black'
          }`}
          onClick={() => setActiveTab('health')}
        >
          Health
        </button>
        <div className="ml-auto">
          <button className="p-2 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stories.slice(0, 6).map((article) => (
          <NewsCard 
            key={article.id} 
            id={article.id}
            title={article.title}
            description={article.description}
            imageUrl={article.imageUrl}
            author={article.author}
            time={article.time}
            readTime={article.readTime || '3min read'}
            category={article.category}
            tags={article.tags}
            likes={article.likes || 0}
            onOpenModal={onOpenModal}
          />
        ))}
      </div>
      
      {/* View More Button */}
      <div className="text-center mt-8">
        <button className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-8 rounded hover:bg-gray-50 transition-colors">
          VIEW MORE
        </button>
      </div>
    </div>
  );
};

export default LatestStories;
