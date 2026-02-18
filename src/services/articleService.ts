import type { Article, PaginationMeta, SearchFilters } from "@/types";

interface ApiArticle {
  id: number; title: string; slug: string; excerpt: string; content: string;
  featured_image: string; category_id: number; author_id: number;
  status: string; published_at: string; scheduled_at: string | null;
  views: number; featured: number; urgent: number; breaking: number;
  read_time: string; created_at: string; updated_at: string;
  category_name: string; category_slug: string; author_name: string;
  tags: { name: string; slug: string }[];
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: PaginationMeta;
  error?: string;
}

function mapArticle(a: ApiArticle): Article {
  return {
    id: String(a.id),
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt || "",
    content: a.content || "",
    imageUrl: a.featured_image || "",
    category: a.category_name || "",
    categorySlug: a.category_slug || "",
    author: { id: String(a.author_id), name: a.author_name || "ALNN" },
    publishedAt: a.published_at || a.created_at,
    updatedAt: a.updated_at,
    readTime: a.read_time || "3 min lexim",
    views: a.views || 0,
    featured: !!a.featured,
    urgent: !!a.urgent,
    breaking: !!a.breaking,
    tags: (a.tags || []).map((t) => t.name),
  };
}

async function fetchApi<T>(endpoint: string): Promise<ApiResponse<T>> {
  const res = await fetch(`/api${endpoint}`);
  return res.json();
}

export async function getAllArticles(page = 1, limit = 20): Promise<{ articles: Article[]; meta: PaginationMeta }> {
  const res = await fetchApi<ApiArticle[]>(`/articles?page=${page}&limit=${limit}`);
  return {
    articles: (res.data || []).map(mapArticle),
    meta: res.meta || { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: limit },
  };
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    const res = await fetchApi<ApiArticle>(`/articles/slug/${slug}`);
    return res.data ? mapArticle(res.data) : undefined;
  } catch { return undefined; }
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const res = await fetchApi<ApiArticle[]>("/articles?featured=true&limit=6");
  return (res.data || []).map(mapArticle);
}

export async function getLatestArticles(limit = 6): Promise<Article[]> {
  const res = await fetchApi<ApiArticle[]>(`/articles?limit=${limit}`);
  return (res.data || []).map(mapArticle);
}

export async function getArticlesByCategory(
  categorySlug: string, page = 1
): Promise<{ articles: Article[]; meta: PaginationMeta }> {
  const res = await fetchApi<ApiArticle[]>(`/articles?category=${categorySlug}&page=${page}&limit=9`);
  return {
    articles: (res.data || []).map(mapArticle),
    meta: res.meta || { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 9 },
  };
}

export async function getRelatedArticles(article: Article, limit = 4): Promise<Article[]> {
  const res = await fetchApi<ApiArticle[]>(`/articles?category=${article.categorySlug}&limit=${limit + 1}`);
  return (res.data || []).map(mapArticle).filter((a) => a.id !== article.id).slice(0, limit);
}

export async function searchArticles(
  filters: SearchFilters
): Promise<{ articles: Article[]; meta: PaginationMeta }> {
  const params = new URLSearchParams();
  if (filters.query) params.set("search", filters.query);
  if (filters.category) params.set("category", filters.category);
  params.set("page", String(filters.page || 1));
  params.set("limit", "9");

  const res = await fetchApi<ApiArticle[]>(`/articles?${params}`);
  return {
    articles: (res.data || []).map(mapArticle),
    meta: res.meta || { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 9 },
  };
}
