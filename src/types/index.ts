export interface Author {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  categorySlug: string;
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  readTime: string;
  views: number;
  featured: boolean;
  urgent: boolean;
  breaking: boolean;
  tags: string[];
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  count: number;
  icon?: string;
}

export interface BreakingNewsItem {
  id: string;
  text: string;
  timestamp: string;
}

export interface NewsletterSubscription {
  email: string;
  subscribedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface SearchFilters {
  query: string;
  category?: string;
  sortBy?: "date" | "views" | "relevance";
  page?: number;
}
