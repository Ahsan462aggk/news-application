import React from 'react';
import { UnifiedArticle } from '@/lib/adapters';
import Image from 'next/image';

interface EditorPicksProps {
  editorPicks: UnifiedArticle[];
  onOpenModal: (news: any) => void;
}

const EditorPicks: React.FC<EditorPicksProps> = ({ editorPicks, onOpenModal }) => {
  if (!editorPicks || editorPicks.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Editor's Picks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {editorPicks.map((article) => (
            <div
              key={article.id}
              onClick={() => onOpenModal(article)}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="relative w-full h-40 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <h3 className="font-bold text-gray-900 line-clamp-3">{article.title}</h3>
              {article.author && (
                <p className="text-sm text-gray-600 mt-2">{article.author}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorPicks;
