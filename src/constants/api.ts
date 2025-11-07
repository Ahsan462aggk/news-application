// New York Times API constants
export const NYT_API_KEY = process.env.NEXT_PUBLIC_NYT_API_KEY || 'your-api-key';
export const NYT_API_BASE_URL = 'https://api.nytimes.com/svc';

// API endpoints
export const ENDPOINTS = {
  topStories: `${NYT_API_BASE_URL}/topstories/v2`,
  search: `${NYT_API_BASE_URL}/search/v2/articlesearch.json`,
  mostPopular: `${NYT_API_BASE_URL}/mostpopular/v2`,
};

// Categories for the home page
export const CATEGORIES = [
  { id: 'politics', name: 'Politics', icon: 'government' },
  { id: 'science', name: 'Science', icon: 'flask' },
  { id: 'technology', name: 'Technology', icon: 'cpu' },
  { id: 'health', name: 'Health', icon: 'heart-pulse' },
  { id: 'business', name: 'Business', icon: 'briefcase' },
  { id: 'sports', name: 'Sports', icon: 'trophy' },
];
