import React from 'react';
import NewsCard from './NewsCard';
import { UnifiedArticle } from '@/lib/adapters';

interface SearchResultsProps {
  results: UnifiedArticle[];
  title?: string;
  onOpenModal?: (news: any) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results,
  title = "Search Results",
  onOpenModal
}) => {
  return (
    <div className="w-full">
      {title && (
        <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-gray-800">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {results.map((article) => (
          <NewsCard
            key={article.id}
            id={article.id}
            title={article.title}
            description={article.description}
            author={article.author}
            time={article.time}
            readTime={article.readTime || '3min read'}
            imageUrl={article.imageUrl}
            category={article.category}
            tags={article.tags}
            likes={article.likes || 0}
            onOpenModal={onOpenModal}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
