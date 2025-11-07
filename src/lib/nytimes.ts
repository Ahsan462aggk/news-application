import { ENDPOINTS, NYT_API_KEY } from '@/constants/api';

// Simple in-memory cache for API requests
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 7200000; // 2 hours in milliseconds (increased to reduce API calls)

// Helper function to get cached data or fetch new data
async function fetchWithCache<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>
): Promise<T> {
  const cached = cache.get(cacheKey);
  const now = Date.now();
  
  // Return cached data if it's still valid
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  
  // Fetch new data
  const data = await fetchFn();
  cache.set(cacheKey, { data, timestamp: now });
  return data;
}

// Helper function to handle rate limiting with exponential backoff
async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  maxRetries: number = 3
): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      // If rate limited, wait and retry
      if (response.status === 429) {
        const waitTime = Math.pow(2, i) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.warn(`Rate limited. Retrying in ${waitTime}ms... (attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      return response;
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const waitTime = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw lastError || new Error('Failed to fetch after retries');
}

// Map search queries to NYT sections
const SECTION_MAP: Record<string, string> = {
  'politics': 'politics',
  'election': 'politics',
  'elections': 'politics',
  'vote': 'politics',
  'government': 'politics',
  'business': 'business',
  'economy': 'business',
  'technology': 'technology',
  'tech': 'technology',
  'science': 'science',
  'health': 'health',
  'medical': 'health',
  'sports': 'sports',
  'arts': 'arts',
  'movies': 'movies',
  'theater': 'theater',
  'world': 'world',
  'international': 'world',
  'us': 'us',
  'opinion': 'opinion',
  'food': 'food',
  'travel': 'travel',
  'magazine': 'magazine',
  'realestate': 'realestate',
  'fashion': 'fashion',
  'style': 'fashion',
  'insider': 'insider',
  'sundayreview': 'sundayreview',
  'upshot': 'upshot'
};

// Types for API responses
export interface NYTArticle {
  title: string;
  abstract: string;
  url: string;
  byline: string;
  published_date: string;
  multimedia?: Array<{
    url: string;
    format: string;
    height: number;
    width: number;
    type: string;
    subtype: string;
    caption: string;
    copyright: string;
  }>;
  section: string;
  subsection: string;
  des_facet?: string[];
  org_facet?: string[];
  per_facet?: string[];
  geo_facet?: string[];
  uri?: string;
  _id?: string;
}

export interface SearchResult {
  docs: Array<{
    abstract: string;
    web_url: string;
    snippet: string;
    lead_paragraph: string;
    print_section: string;
    print_page: string;
    source: string;
    multimedia: Array<{
      rank: number;
      subtype: string;
      caption: null | string;
      credit: null | string;
      type: string;
      url: string;
      height: number;
      width: number;
      legacy: {
        xlarge: string;
        xlargewidth: number;
        xlargeheight: number;
      };
      subType: string;
      crop_name: string;
    }>;
    headline: {
      main: string;
      kicker: string;
      content_kicker: null | string;
      print_headline: string;
      name: null | string;
      seo: null | string;
      sub: null | string;
    };
    keywords: Array<{
      name: string;
      value: string;
      rank: number;
      major: string;
    }>;
    pub_date: string;
    document_type: string;
    news_desk: string;
    section_name: string;
    byline: {
      original: string;
      person: Array<{
        firstname: string;
        middlename: null | string;
        lastname: string;
        qualifier: null | string;
        title: null | string;
        role: string;
        organization: string;
        rank: number;
      }>;
      organization: null | string;
    };
    type_of_material: string;
    _id: string;
    word_count: number;
    uri: string;
  }>;
  meta: {
    hits: number;
    offset: number;
    time: number;
  };
}

// API functions
export async function getTopStories(section: string = 'home'): Promise<NYTArticle[]> {
  const cacheKey = `top-stories-${section}`;
  
  return fetchWithCache(cacheKey, async () => {
    try {
      const url = `${ENDPOINTS.topStories}/${section}.json?api-key=${NYT_API_KEY}`;
      const response = await fetchWithRetry(url, { next: { revalidate: 3600 } });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch top stories: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching top stories:', error);
      return [];
    }
  });
}

export async function getMostPopular(period: number = 1): Promise<NYTArticle[]> {
  const cacheKey = `most-popular-${period}`;
  
  return fetchWithCache(cacheKey, async () => {
    try {
      const url = `${ENDPOINTS.mostPopular}/viewed/${period}.json?api-key=${NYT_API_KEY}`;
      const response = await fetchWithRetry(url, { next: { revalidate: 3600 } });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch most popular: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching most popular:', error);
      return [];
    }
  });
}

export async function searchArticles(
  query: string,
  page: number = 0,
  sort: string = 'newest'
): Promise<SearchResult> {
  const cacheKey = `search-${query}-${page}-${sort}`;
  
  return fetchWithCache(cacheKey, async () => {
    try {
      const url = `${ENDPOINTS.search}?q=${encodeURIComponent(query)}&page=${page}&sort=${sort}&api-key=${NYT_API_KEY}`;
      const response = await fetchWithRetry(url, { next: { revalidate: 300 } });
      
      if (!response.ok) {
        throw new Error(`Failed to search articles: ${response.status}`);
      }
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error searching articles:', error);
      return { docs: [], meta: { hits: 0, offset: 0, time: 0 } };
    }
  });
}

/**
 * Search using Top Stories API (better image support than Search API)
 * Maps search query to relevant section or uses 'home' as fallback
 */
export async function searchTopStories(query: string): Promise<NYTArticle[]> {
  const cacheKey = `search-top-stories-${query}`;
  
  return fetchWithCache(cacheKey, async () => {
    try {
      // Find matching section from query
      const queryLower = query.toLowerCase().trim();
      let section = 'home';
      
      // Check if query matches any section keyword
      for (const [keyword, sectionName] of Object.entries(SECTION_MAP)) {
        if (queryLower.includes(keyword)) {
          section = sectionName;
          break;
        }
      }
      
      
      
      // Fetch top stories from the matched section
      const articles = await getTopStories(section);
      
      // Filter articles by query text for more relevant results
      if (query.trim()) {
        const filtered = articles.filter(article => {
          const searchText = `${article.title} ${article.abstract}`.toLowerCase();
          return searchText.includes(queryLower);
        });
        
        
        
        // Return filtered results if any, otherwise return all section articles
        return filtered.length > 0 ? filtered : articles;
      }
      
      return articles;
    } catch (error) {
      console.error('❌ Error searching top stories:', error);
      return [];
    }
  });
}

export async function getArticleByUrl(url: string): Promise<NYTArticle | null> {
  try {
    // Extract the article ID from the URL
    const urlParts = url.split('/');
    const id = urlParts[urlParts.length - 1].replace('.html', '');
    
    // Search for the article using the ID
    const searchResult = await searchArticles(`_id:${id}`);
    
    if (searchResult.docs && searchResult.docs.length > 0) {
      const article = searchResult.docs[0];
      
      // Transform to NYTArticle format
      return {
        title: article.headline.main,
        abstract: article.abstract || article.snippet,
        url: article.web_url,
        byline: article.byline.original || '',
        published_date: article.pub_date,
        section: article.section_name,
        subsection: article.news_desk || '',
        multimedia: article.multimedia?.map(item => ({
          url: `https://www.nytimes.com/${item.url}`,
          format: item.type,
          height: item.height,
          width: item.width,
          type: item.type,
          subtype: item.subtype,
          caption: item.caption || '',
          copyright: item.credit || '',
        })),
        _id: article._id,
        uri: article.uri,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching article by URL:', error);
    return null;
  }
}
