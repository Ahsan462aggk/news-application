import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchResults from '../components/SearchResults';
import ViewMore from '../components/ViewMore';
import NewsModal from '../components/NewsModal';
import useNewsModal from '@/hooks/useNewsModal';
import { Search } from 'lucide-react';
import { searchTopStories } from '@/lib/nytimes';
import { adaptNYTArticle } from '@/lib/adapters';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

// SSR for search page
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const q = (query.query || query.q || query.tag || '') as string;
  let initialResults: any[] = [];
  try {
    if (q) {
      const articles = await searchTopStories(q);
      initialResults = (articles || []).map(adaptNYTArticle);
    }
  } catch (e) {
    initialResults = [];
  }
  return {
    props: {
      initialQuery: q,
      initialResults,
    },
  };
};

interface SearchSSRProps {
  initialQuery: string;
  initialResults: any[];
}

const SearchPage: React.FC<SearchSSRProps> = ({ initialQuery, initialResults }) => {
  const router = useRouter();
  const { q, query, tag } = router.query;
  const { isOpen, selectedNews, openModal, closeModal } = useNewsModal();
  
  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [allResults, setAllResults] = useState<any[]>(initialResults || []); // All fetched results
  const [displayedResults, setDisplayedResults] = useState<any[]>([]); // Paginated results
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalHits, setTotalHits] = useState(0);
  const ITEMS_PER_PAGE = 9; // 3x3 grid

  // Initialize search query from URL parameters (support both 'q' and 'query')
  // Seed from SSR on first render; and react to URL changes client-side
  useEffect(() => {
    if (initialResults && initialResults.length) {
      setAllResults(initialResults);
      setTotalHits(initialResults.length);
    }
  }, []);

  useEffect(() => {
    const searchParam = (query || q || tag) as string;
    if (searchParam && typeof searchParam === 'string' && searchParam !== initialQuery) {
      setSearchQuery(searchParam);
      performSearch(searchParam);
    }
  }, [q, query, tag]);

  // Paginate results whenever allResults or currentPage changes
  useEffect(() => {
    if (allResults.length > 0) {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setDisplayedResults(allResults.slice(startIndex, endIndex));
    }
  }, [allResults, currentPage]);

  // Handle search on Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      performSearch(searchQuery);
      // Update URL with search query (use 'query' parameter)
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`, undefined, { shallow: true });
    }
  };

  // Handle search button click
  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
      // Update URL with search query (use 'query' parameter)
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`, undefined, { shallow: true });
    }
  };

  const performSearch = async (query: string) => {
    setIsSearching(true);
    setCurrentPage(1); // Reset to first page
    
    try {
      const articles = await searchTopStories(query);
      const adaptedResults = (articles || []).map(adaptNYTArticle);
      setAllResults(adaptedResults);
      setTotalHits(adaptedResults.length);
    } catch (error) {
      console.error('❌ Error searching articles:', error);
      setAllResults([]);
      setDisplayedResults([]);
      setTotalHits(0);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const totalPages = Math.ceil(totalHits / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>Search News | NBC News</title>
        <meta name="description" content="Search for news articles on NBC News" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow bg-gray-50 py-10 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-12 text-gray-900">Search News</h1>
          
          <div className="mb-12 md:mb-16">
            <div className="w-full max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Corona Virus Updates"
                  className="w-full py-4 pl-12 pr-4 text-gray-700 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 text-base shadow-sm"
                  autoFocus
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          {isSearching ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600 text-lg">Searching...</p>
            </div>
          ) : searchQuery ? (
            displayedResults.length > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Search Results ({totalHits} articles found)
                  </h2>
                  {totalPages > 1 && (
                    <p className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </p>
                  )}
                </div>
                <SearchResults 
                  results={displayedResults} 
                  title="" 
                  onOpenModal={openModal}
                />
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-4">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-gray-700 font-medium">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">No results found for "{searchQuery}"</p>
                <p className="text-sm text-gray-500 mt-2">Try different keywords or check your spelling</p>
              </div>
            )
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Enter a search term to find news articles</p>
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

export default SearchPage;
