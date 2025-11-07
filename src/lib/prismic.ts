import * as prismic from '@prismicio/client';
import * as prismicNext from '@prismicio/next';

export const repositoryName = process.env.PRISMIC_REPOSITORY_NAME || 'your-repo-name';

// Create a Prismic client
export const createClient = (config: prismicNext.CreateClientConfig = {}) => {
  const client = prismic.createClient(repositoryName, {
    ...config,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  return client;
};

// Helper to generate routes for Prismic documents
export const linkResolver = (doc: any) => {
  if (doc.type === 'article') {
    return `/article/${doc.uid}`;
  }
  
  if (doc.type === 'category') {
    return `/category/${doc.uid}`;
  }
  
  return '/';
};

// Get featured articles from Prismic
export async function getFeaturedArticles() {
  const client = createClient();
  
  const articles = await client.getAllByType('article', {
    predicates: [
      prismic.predicate.at('document.tags', ['featured']),
    ],
    orderings: {
      field: 'document.first_publication_date',
      direction: 'desc',
    },
    limit: 5,
  });
  
  return articles;
}

// Get articles by category from Prismic
export async function getArticlesByCategory(category: string) {
  const client = createClient();
  
  const articles = await client.getAllByType('article', {
    predicates: [
      prismic.predicate.at('my.article.category', category),
    ],
    orderings: {
      field: 'document.first_publication_date',
      direction: 'desc',
    },
  });
  
  return articles;
}

// Get article by UID from Prismic
export async function getArticleByUID(uid: string) {
  const client = createClient();
  
  const article = await client.getByUID('article', uid);
  
  return article;
}

// Get random Prismic article images for fallback
export async function getPrismicImages(count: number = 10) {
  const client = createClient();
  
  try {
    
    
    const articles = await client.getAllByType('article', {
      orderings: {
        field: 'document.first_publication_date',
        direction: 'desc',
      },
      limit: count,
    });
    
    
    
    // Extract just the image URLs
    const imageUrls = articles
      .map(article => {
        const url = article.data?.featured_image?.url;
        
        return url;
      })
      .filter(url => url && url !== ''); // Filter out empty/null URLs
    
    
    return imageUrls;
  } catch (error) {
    console.error('❌ Error fetching Prismic images:', error);
    console.error('Repository:', repositoryName);
    console.error('Has token:', !!process.env.PRISMIC_ACCESS_TOKEN);
    return [];
  }
}
