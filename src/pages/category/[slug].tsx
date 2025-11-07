import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import NewsCard from '../../components/NewsCard';
import NewsModal from '../../components/NewsModal';
import useNewsModal from '@/hooks/useNewsModal';
import { GetServerSideProps } from 'next';
import { getTopStories } from '@/lib/nytimes';
import { UnifiedArticle, adaptNYTArticle } from '@/lib/adapters';

// Map of category slugs to NYT API section names
const CATEGORY_MAP: Record<string, string> = {
  'corona-updates': 'health',
  'politics': 'politics',
  'business': 'business',
  'sports': 'sports',
  'world': 'world',
  'travel': 'travel',
  'podcasts': 'podcasts',
  'technology': 'technology',
  'science': 'science',
  'health': 'health',
  'arts': 'arts',
};

// Map of category slugs to display names
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'corona-updates': 'Corona Updates',
  'politics': 'Politics',
  'business': 'Business',
  'sports': 'Sports',
  'world': 'World',
  'travel': 'Travel',
  'podcasts': 'Podcasts',
  'technology': 'Technology',
  'science': 'Science',
  'health': 'Health',
  'arts': 'Arts',
};

interface CategoryPageProps {
  articles: UnifiedArticle[];
  category: string;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;
  const nytSection = CATEGORY_MAP[slug] || 'home';
  
  try {
    // Get articles from NYT API for this category
    const nytArticles = await getTopStories(nytSection);
    
    // Handle null or empty response
    if (!nytArticles || !Array.isArray(nytArticles) || nytArticles.length === 0) {
      console.warn(`No articles returned for category ${slug}`);
      return {
        props: {
          articles: [],
          category: slug,
        },
      };
    }
    
    const articles = nytArticles.map(adaptNYTArticle);
    
    return {
      props: {
        articles,
        category: slug,
      },
    };
  } catch (error) {
    console.error(`Error fetching articles for category ${slug}:`, error);
    return {
      props: {
        articles: [],
        category: slug,
      },
    };
  }
};

const CategoryPage: React.FC<CategoryPageProps> = ({ articles, category }) => {
  const router = useRouter();
  const { isOpen, selectedNews, openModal, closeModal } = useNewsModal();
  const displayName = CATEGORY_DISPLAY_NAMES[category] || category;
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Head>
        <title>{displayName} | NBC News</title>
        <meta name="description" content={`Latest ${displayName.toLowerCase()} news and updates`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow py-6 md:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">{displayName}</h1>
          
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map((article) => (
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
                  onOpenModal={openModal}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600">No articles found for {displayName}</p>
              <p className="text-sm text-gray-500 mt-2">Please check back later for updates</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      
      {/* News Modal */}
      {selectedNews && (
        <NewsModal
          isOpen={isOpen}
          onClose={closeModal}
          news={selectedNews}
        />
      )}
    </div>
  );
};

export default CategoryPage;
