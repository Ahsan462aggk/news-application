import React from 'react';
import { UnifiedArticle } from '@/lib/adapters';

interface BreakingNewsProps {
  breakingNews?: UnifiedArticle;
  onOpenModal?: (news: any) => void;
}

const BreakingNews: React.FC<BreakingNewsProps> = ({ breakingNews, onOpenModal }) => {
  if (!breakingNews) {
    return null;
  }

  return (
    <div className="bg-red-600 text-white">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <span className="font-bold text-sm bg-white text-red-600 px-3 py-1 mr-4 rounded">
          Breaking News
        </span>
        <p 
          className="text-sm flex-1 cursor-pointer hover:underline"
          onClick={() => onOpenModal && onOpenModal(breakingNews)}
        >
          {breakingNews.title}
        </p>
      </div>
    </div>
  );
};

export default BreakingNews;
