import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ArticleCard, ArticleCardSkeleton } from "@/components/articles/ArticleCard";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { searchArticles } from "@/services/articleService";
import { CATEGORIES } from "@/constants";
import type { Article, PaginationMeta } from "@/types";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [searchInput, setSearchInput] = useState(query);
  const [articles, setArticles] = useState<Article[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      searchArticles({ query, category: category || undefined, page: pageParam })
        .then((res) => { setArticles(res.articles); setMeta(res.meta); })
        .finally(() => setIsLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query, category, pageParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim(), ...(category && { category }) });
    }
  };

  const handleCategoryFilter = (slug: string) => {
    const newCategory = slug === category ? "" : slug;
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (newCategory) params.category = newCategory;
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    const params: Record<string, string> = { page: String(page) };
    if (query) params.q = query;
    if (category) params.category = category;
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 space-y-4">
          <h1 className="text-2xl font-bold text-foreground">
            {query
              ? <>Rezultatet për: <span className="text-primary">"{query}"</span></>
              : "Kërko lajme"}
          </h1>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input type="search" placeholder="Kërko artikuj..." value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)} className="pl-9" />
            </div>
            <Button type="submit">Kërko</Button>
          </form>

          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <Button variant={!category ? "default" : "outline"} size="sm"
              onClick={() => handleCategoryFilter("")} className="h-7 text-xs">Të gjitha</Button>
            {CATEGORIES.map((cat) => (
              <Button key={cat.slug} variant={category === cat.slug ? "default" : "outline"}
                size="sm" onClick={() => handleCategoryFilter(cat.slug)} className="h-7 text-xs">
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <ArticleCardSkeleton key={i} />)}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <Search className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                <p className="text-lg text-muted-foreground">Nuk u gjetën rezultate.</p>
                <p className="text-sm text-muted-foreground">Provoni me fjalë të ndryshme.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  U gjetën {meta?.totalItems || 0} artikuj
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {articles.map((article) => <ArticleCard key={article.id} article={article} />)}
                </div>
                {meta && meta.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button variant="outline" size="sm" disabled={meta.currentPage <= 1}
                      onClick={() => handlePageChange(meta.currentPage - 1)}>
                      <ChevronLeft className="h-4 w-4 mr-1" /> Para
                    </Button>
                    <span className="text-sm text-muted-foreground px-4">
                      Faqja {meta.currentPage} / {meta.totalPages}
                    </span>
                    <Button variant="outline" size="sm" disabled={meta.currentPage >= meta.totalPages}
                      onClick={() => handlePageChange(meta.currentPage + 1)}>
                      Tjetra <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="lg:col-span-1"><Sidebar /></div>
        </div>
      </div>
    </Layout>
  );
}
