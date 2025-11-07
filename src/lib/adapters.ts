import { NYTArticle, SearchResult } from './nytimes';
import { createClient } from './prismic';

// Unified article interface that works with both NYT and Prismic data
export interface UnifiedArticle {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  time: string;
  readTime?: string;
  category?: string;
  tags?: string[];
  likes?: number;
  url?: string;
}

/**
 * Adapts NYT article data (Top Stories, Most Popular, etc.) to unified format
 */
export function adaptNYTArticle(article: NYTArticle): UnifiedArticle {
  // Calculate estimated read time
  const wordCount = article.abstract?.split(' ').length || 0;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))}min read`;

  // Handle image extraction for Top Stories (different structure from Search)
  const image =
    article.multimedia?.find(
      (m) =>
        m.format === 'mediumThreeByTwo210' ||
        m.format === 'mediumThreeByTwo440' ||
        m.format === 'Standard Thumbnail'
    ) || article.multimedia?.[0];

  const imageUrl = image
    ? image.url.startsWith('http')
      ? image.url
      : `https://static01.nyt.com/${image.url}`
    : '/placeholder.svg';

  return {
    id: article._id || article.uri || article.url.split('/').pop() || '',
    title: article.title || 'Untitled',
    description: article.abstract || '',
    imageUrl,
    author: article.byline?.replace('By ', '') || 'Unknown Author',
    time: new Date(article.published_date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    readTime,
    category: article.section?.toUpperCase() || 'GENERAL',
    tags: [
      ...(article.des_facet || []).slice(0, 2),
      ...(article.org_facet || []).slice(0, 1),
      ...(article.per_facet || []).slice(0, 1),
    ].slice(0, 3),
    url: article.url,
  };
}

/**
 * ✅ Updated for 2025 — Adapts NYT Search API results to unified format
 */
export function adaptNYTSearchResult(article: SearchResult['docs'][0]): UnifiedArticle {
  const baseUrl = 'https://static01.nyt.com/';
  const wordCount = article.word_count || 0;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))}min read`;

  let imageUrl = '/placeholder.svg';

  if (Array.isArray(article.multimedia) && article.multimedia.length > 0) {
    // Updated to handle new API format (uses crop_name)
    const best = article.multimedia.find(
      (m: any) =>
        m.crop_name === 'default' ||
        m.crop_name === 'thumbnail' ||
        m.type === 'image'
    );

    if (best?.url) {
      imageUrl = best.url.startsWith('http')
        ? best.url
        : baseUrl + best.url.replace(/^\/+/, '');
    }
  }

  return {
    id: article._id || article.uri || crypto.randomUUID(),
    title: article.headline?.main || 'Untitled',
    description:
      article.abstract ||
      article.snippet ||
      article.lead_paragraph ||
      'No description available.',
    imageUrl,
    author: article.byline?.original?.replace('By ', '') || 'Unknown Author',
    time: new Date(article.pub_date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    readTime,
    category: article.section_name?.toUpperCase() || 'GENERAL',
    tags: article.keywords?.slice(0, 3).map((k) => k.value) || [],
    url: article.web_url,
  };
}

/**
 * Adapts Prismic article data to unified format
 */
export function adaptPrismicArticle(prismicArticle: any): UnifiedArticle {
  const data = prismicArticle.data;

  const contentText = data.content?.length
    ? data.content.map((block: any) => block.text || '').join(' ')
    : '';
  const wordCount = contentText?.split(' ').length || 0;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))}min read`;

  return {
    id: prismicArticle.uid || prismicArticle.id,
    title: data.title?.[0]?.text || 'Untitled',
    description: data.excerpt?.[0]?.text || '',
    imageUrl: data.featured_image?.url || '/placeholder.svg',
    author: data.author || 'Unknown Author',
    time: new Date(prismicArticle.first_publication_date).toLocaleDateString(
      'en-US',
      {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }
    ),
    readTime,
    category: data.category || 'GENERAL',
    tags: data.tags || [],
    likes: 0,
    url: data.url || '',
  };
}

/**
 * Combines featured articles from Prismic + NYT into a unified array
 */
export async function getCombinedFeaturedArticles(
  count: number = 10
): Promise<UnifiedArticle[]> {
  try {
    const client = createClient();

    // Fetch featured articles from Prismic
    const prismicArticles = await client.getAllByTag('featured');
    const adaptedPrismicArticles = prismicArticles.map((a) =>
      adaptPrismicArticle(a)
    );

    // Dynamically import NYT functions (avoid circular imports)
    const { getTopStories } = await import('./nytimes');

    const nytArticles = await getTopStories('home');
    const adaptedNYTArticles = nytArticles
      .slice(0, count - adaptedPrismicArticles.length)
      .map(adaptNYTArticle);

    // Combine and randomize
    return [...adaptedPrismicArticles, ...adaptedNYTArticles]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  } catch (error) {
    console.error('❌ Error fetching combined articles:', error);
    return [];
  }
}
