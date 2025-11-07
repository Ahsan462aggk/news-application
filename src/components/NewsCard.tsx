import React from 'react';
import Image from 'next/image';
import { Heart, Share2, Bookmark } from 'lucide-react';
import { useRouter } from 'next/router';

interface NewsCardProps {
  category?: string;
  title: string;
  author: string;
  time: string;
  readTime: string;
  imageUrl: string;
  likes?: number;
  id?: string;
  description?: string;
  tags?: string[];
  onOpenModal?: (news: any) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ 
  category, 
  title, 
  author, 
  time, 
  readTime, 
  imageUrl, 
  likes = 0, 
  id,
  description = '',
  tags = [],
  onOpenModal
 }) => {
  const router = useRouter();
  return (
    <div className="border border-gray-200 rounded overflow-hidden bg-white hover:shadow-lg transition-shadow cursor-pointer">
      <div 
        className="w-full h-48 bg-gray-200 relative" 
        onClick={(e) => {
          if (onOpenModal) {
            e.stopPropagation();
            onOpenModal({
              id: id || title,
              title,
              description,
              imageUrl,
              author,
              time,
              tags,
              likes
            });
          } else {
            router.push(`/article/${id || encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))}`);
          }
        }}
      >
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>
      <div className="p-5">
        <h3 
          className="font-bold text-base leading-snug line-clamp-3 min-h-[3.6rem] cursor-pointer hover:text-gray-700 transition-colors" 
          onClick={(e) => {
            if (onOpenModal) {
              e.stopPropagation();
              onOpenModal({
                id: id || title,
                title,
                description,
                imageUrl,
                author,
                time,
                tags,
                likes
              });
            } else {
              router.push(`/article/${id || encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))}`);
            }
          }}
        >
          {title}
        </h3>
        <div className="text-xs text-gray-500 mt-3 flex items-center flex-wrap">
          <span>{time}</span>
          <span className="mx-1">by {author}</span>
          <span className="ml-auto">| {readTime}</span>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <button className="flex items-center text-gray-400 hover:text-red-600 transition-colors">
            <Heart className="w-4 h-4 mr-1" />
            <span className="text-xs">{likes}</span>
          </button>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
