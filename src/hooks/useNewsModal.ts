import { useState } from 'react';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  time: string;
  tags?: string[];
  likes?: number;
}

export const useNewsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const openModal = (news: NewsItem) => {
    setSelectedNews(news);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // Reset selected news after animation completes
    setTimeout(() => {
      setSelectedNews(null);
    }, 300);
  };

  return {
    isOpen,
    selectedNews,
    openModal,
    closeModal,
  };
};

export default useNewsModal;
