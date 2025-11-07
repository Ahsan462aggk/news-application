import Header from '@/components/Header';
import BreakingNews from '@/components/BreakingNews';
import Hero from '@/components/Hero';
import LatestStories from '@/components/LatestStories';
import EditorPicks from '@/components/EditorPicks';
import Footer from '@/components/Footer';
import NewsModal from '@/components/NewsModal';
import useNewsModal from '@/hooks/useNewsModal';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getTopStories } from '@/lib/nytimes';
import { getFeaturedArticles } from '@/lib/prismic';
import { UnifiedArticle, adaptNYTArticle, adaptPrismicArticle, getCombinedFeaturedArticles } from '@/lib/adapters';

interface HomeProps {
  featuredArticles: UnifiedArticle[];
  latestStories: UnifiedArticle[];
  opinionStories: UnifiedArticle[];
  healthStories: UnifiedArticle[];
  editorPicks: UnifiedArticle[];
  breakingNews?: UnifiedArticle;
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Get combined featured articles from both sources
    const featuredArticles = await getCombinedFeaturedArticles(1);
    
    // Get latest stories from NYT home section
    const nytLatestStories = await getTopStories('home');
    const latestStories = nytLatestStories.slice(0, 6).map(adaptNYTArticle);
    
    // Get opinion articles from NYT
    const nytOpinionStories = await getTopStories('opinion');
    const opinionStories = nytOpinionStories.slice(0, 6).map(adaptNYTArticle);
    
    // Get health articles from NYT
    const nytHealthStories = await getTopStories('health');
    const healthStories = nytHealthStories.slice(0, 6).map(adaptNYTArticle);
    
    // Get Editor's Picks from home section (reuse data to avoid extra API call)
    // Use articles 7-8 from home section for Editor's Picks
    const editorPicks = nytLatestStories.slice(6, 8).map(adaptNYTArticle);
    
    
    // Get breaking news - use the most recent article from home section
    const breakingNews = nytLatestStories.length > 0 ? adaptNYTArticle(nytLatestStories[0]) : undefined;
    
    return {
      props: {
        featuredArticles,
        latestStories,
        opinionStories,
        healthStories,
        editorPicks,
        breakingNews,
      },
    };
  } catch (error) {
    console.error('Error fetching data for homepage:', error);
    return {
      props: {
        featuredArticles: [],
        latestStories: [],
        opinionStories: [],
        healthStories: [],
        editorPicks: [],
      },
    };
  }
};

export default function Home({ featuredArticles, latestStories, opinionStories, healthStories, editorPicks, breakingNews }: HomeProps) {
  const router = useRouter();
  const { isOpen, selectedNews, openModal, closeModal } = useNewsModal();
  
  // Get the first featured article for the hero section
  const featuredHeroArticle = featuredArticles && featuredArticles.length > 0 ? featuredArticles[0] : undefined;
  
  return (
    <div className="bg-white min-h-screen">
      <Head>
        <title>NBC News - Breaking News & Top Stories</title>
        <meta name="description" content="Latest news, breaking news and current news from around the world" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <Hero onOpenModal={openModal} featuredArticle={featuredHeroArticle} />
      
      {/* Breaking News Banner */}
      <BreakingNews breakingNews={breakingNews} onOpenModal={openModal} />
      
      {/* Latest Stories with Tabs */}
      <LatestStories 
        latestStories={latestStories}
        opinionStories={opinionStories}
        healthStories={healthStories}
        onOpenModal={openModal}
      />
      
      {/* Editor's Picks */}
      <EditorPicks editorPicks={editorPicks} onOpenModal={openModal} />
      
      {/* Footer */}
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
}
