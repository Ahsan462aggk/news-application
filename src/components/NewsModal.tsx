import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Share2, Bookmark } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  news: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    author: string;
    time: string;
    tags?: string[];
    likes?: number;
  };
}

const NewsModal: React.FC<NewsModalProps> = ({ isOpen, onClose, news }) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Handle escape key press to close modal
  useEffect(() => {
    setIsMounted(true);
    
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Don't render on server-side
  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          {/* Backdrop - smoother animation with longer duration */}
          <motion.div
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal - minimal animation to prevent flickering */}
          <motion.div
            className="relative z-10 w-full max-w-5xl bg-white rounded-lg overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-1 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            <div className="flex flex-col md:flex-row h-full max-h-[85vh] md:max-h-[80vh] overflow-hidden">
              {/* Image section - simplified to prevent flickering */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-200 overflow-hidden">
                {/* Static image with no animations or transitions */}
                <div 
                  className="absolute inset-0" 
                  style={{
                    backgroundImage: `url(${news.imageUrl || '/placeholder.svg'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                ></div>
              </div>

              {/* Content section */}
              <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto">
                {/* Trending tag - only show for trending articles */}
                {news.id === 'cake' && (
                  <div className="mb-3">
                    <span className="text-xs font-medium text-red-600 uppercase tracking-wider">Trending</span>
                  </div>
                )}
                
                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {news.title}
                </h2>

                {/* Action buttons */}
                <div className="flex items-center space-x-6 mb-6">
                  <button className="flex items-center text-gray-500 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5 mr-1.5" />
                    <span className="text-xs font-medium">{news.likes || 0}</span>
                  </button>
                  <button className="text-gray-500 hover:text-blue-500 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="text-gray-500 hover:text-yellow-500 transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-6 text-base leading-relaxed">
                  {news.description || 'No description available.'}
                </p>

                {/* Tags */}
                {news.tags && news.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {news.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full cursor-pointer transition-colors"
                        onClick={() => router.push(`/search?tag=${encodeURIComponent(tag)}`)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Author and time */}
                <div className="flex items-center text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
                  <span className="mr-2 font-medium">By {news.author}</span>
                  <span>• {news.time}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NewsModal;
