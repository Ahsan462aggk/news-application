import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, Share2, Bookmark } from 'lucide-react';
import { UnifiedArticle } from '@/lib/adapters';

interface HeroProps {
  onOpenModal?: (news: any) => void;
  featuredArticle?: UnifiedArticle;
  breakingNews?: UnifiedArticle;
}

const Hero: React.FC<HeroProps> = ({ onOpenModal, featuredArticle, breakingNews }) => {
  const [article, setArticle] = useState<UnifiedArticle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!featuredArticle);
  
  // Use the provided featured article or fetch one if not provided
  useEffect(() => {
    if (featuredArticle) {
      setArticle(featuredArticle);
      setIsLoading(false);
    } else {
      // If no featured article is provided, use the default one
      setArticle({
        id: 'trending-news',
        title: 'Cake meme reflects coronavirus absurdity in a world where nothing is what it seems',
        author: 'Lucy Hiddleston',
        time: '2 hours ago',
        readTime: '3min read',
        imageUrl: '/placeholder.svg',
        description: 'Earlier this month, a viral video depicting hyper-realistic cakes as everyday items had folks on social media double-guessing every other post; and sometimes even their own realities, effectively launching the next meme: "Is this real or is this cake?"',
        tags: ['Trending'],
        likes: 25,
        category: 'Trending'
      });
      setIsLoading(false);
    }
  }, [featuredArticle]);
  
  const handleClick = () => {
    if (onOpenModal && article) {
      onOpenModal(article);
    }
  };
  
  if (isLoading || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="w-full h-80 bg-gray-200 rounded-lg animate-pulse"></div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse mb-4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-2/4 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breaking News Banner */}
      {breakingNews && (
        <div className="bg-red-600 text-white mb-6 rounded-lg overflow-hidden">
          <div className="px-4 py-3 flex items-center">
            <span className="font-bold text-sm bg-white text-red-600 px-3 py-1 mr-4 rounded">
              BREAKING NEWS
            </span>
            <p 
              className="text-sm flex-1 cursor-pointer hover:underline"
              onClick={() => onOpenModal && onOpenModal(breakingNews)}
            >
              {breakingNews.title}
            </p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Image on the left */}
        <div className="w-full h-80 bg-blue-100 rounded-lg relative overflow-hidden">
          <Image 
            src={article.imageUrl} 
            alt={article.title} 
            fill 
            className="object-cover" 
            priority
          />
        </div>
        
        {/* Content on the right */}
        <div className="flex flex-col relative">
          <div className="absolute right-0 top-0 flex items-center gap-3">
            <button className="p-2 text-gray-500 hover:text-red-600 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          {/* Category label (forced to Trending) */}
          <span className="text-red-600 font-semibold text-sm mb-3">
            Trending
          </span>
          
          {/* Title */}
          <h1 
            className="text-2xl md:text-3xl font-bold leading-tight mb-4 cursor-pointer hover:text-gray-700 transition-colors"
            onClick={handleClick}
          >
            {article.title}
          </h1>
          
          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {article.description}
          </p>
          
          {/* Metadata */}
          <div className="text-xs text-gray-500 mb-4">
            <span>{article.time}</span>
            <span className="mx-2">by {article.author}</span>
            <span>| {article.readTime}</span>
          </div>
          
          {/* Action icons */}
          
        </div>
      </div>
    </div>
  );
};

export default Hero;
