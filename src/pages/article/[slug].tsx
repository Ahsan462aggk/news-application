import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { getArticleByUID } from '@/lib/prismic';
import { getArticleByUrl } from '@/lib/nytimes';
import { UnifiedArticle, adaptPrismicArticle } from '@/lib/adapters';

interface ArticlePageProps {
  article: UnifiedArticle;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;
  
  try {
    // First try to get article from Prismic
    const prismicArticle = await getArticleByUID(slug);
    
    if (prismicArticle) {
      return {
        props: {
          article: adaptPrismicArticle(prismicArticle)
        }
      };
    }
    
    // If not found in Prismic, try NYT API
    // Decode the slug which might be a URL or ID
    const decodedSlug = decodeURIComponent(slug);
    const nytArticle = await getArticleByUrl(decodedSlug);
    
    if (nytArticle) {
      return {
        props: {
          article: {
            id: nytArticle._id || nytArticle.uri || '',
            title: nytArticle.title,
            description: nytArticle.abstract,
            imageUrl: nytArticle.multimedia?.[0]?.url || '/placeholder.svg',
            author: nytArticle.byline.replace('By ', '') || 'Unknown Author',
            time: new Date(nytArticle.published_date).toLocaleDateString(),
            readTime: '3 min read', // Estimated
            category: nytArticle.section.toUpperCase(),
            tags: [
              ...(nytArticle.des_facet || []).slice(0, 2),
              ...(nytArticle.org_facet || []).slice(0, 1)
            ].slice(0, 3),
            url: nytArticle.url
          }
        }
      };
    }
    
    // If article not found in either source
    return {
      props: {
        article: {
          id: slug,
          title: 'Article not found',
          description: 'The requested article could not be found.',
          imageUrl: '/placeholder.svg',
          author: 'Unknown',
          time: new Date().toLocaleDateString(),
          readTime: '1 min read',
          category: 'ERROR',
          tags: []
        }
      }
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return {
      props: {
        article: {
          id: slug,
          title: 'Error loading article',
          description: 'There was an error loading this article.',
          imageUrl: '/placeholder.svg',
          author: 'Unknown',
          time: new Date().toLocaleDateString(),
          readTime: '1 min read',
          category: 'ERROR',
          tags: []
        }
      }
    };
  }
};

const ArticlePage: React.FC<ArticlePageProps> = ({ article }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Head>
        <title>{article.title} | NBC News</title>
        <meta name="description" content={article.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow py-6 md:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {article.title}
            </h1>
            
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span>Published {article.time}</span>
              <span className="mx-2">•</span>
              <span>By {article.author}</span>
              {article.readTime && (
                <>
                  <span className="mx-2">•</span>
                  <span>{article.readTime}</span>
                </>
              )}
            </div>
            
            <div className="w-full h-96 bg-gray-200 relative mb-8">
              <Image 
                src={article.imageUrl} 
                alt={article.title} 
                layout="fill" 
                objectFit="cover" 
              />
            </div>
            
            <div className="prose max-w-none">
              <p className="text-lg mb-4">
                {article.description}
              </p>
              
              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 my-6">
                  {article.tags.map((tag, index) => (
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
              
              {/* Source link */}
              {article.url && (
                <div className="mt-8 pt-4 border-t border-gray-100">
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Read full article at source
                  </a>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button 
                onClick={() => router.back()}
                className="text-blue-600 hover:underline flex items-center"
              >
                ← Back to previous page
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticlePage;
