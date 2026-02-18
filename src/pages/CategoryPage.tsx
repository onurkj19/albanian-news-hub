import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ArticleCard, ArticleCardSkeleton } from "@/components/articles/ArticleCard";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import { getCategoryBySlug } from "@/constants";
import { getArticlesByCategory } from "@/services/articleService";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NotFound from "./NotFound";
import type { Article, PaginationMeta } from "@/types";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState<Article[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const category = slug ? getCategoryBySlug(slug) : undefined;

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    getArticlesByCategory(category.slug, currentPage)
      .then((res) => { setArticles(res.articles); setMeta(res.meta); })
      .finally(() => setLoading(false));
  }, [category?.slug, currentPage]);

  if (!category) return <NotFound />;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 pb-4 border-b border-border">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{category.name}</h1>
          <p className="text-muted-foreground mt-1">{category.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <ArticleCardSkeleton key={i} />)}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  Nuk ka artikuj në këtë kategori aktualisht.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>

                {meta && meta.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button variant="outline" size="sm" disabled={meta.currentPage <= 1}
                      onClick={() => setCurrentPage((p) => p - 1)}>
                      <ChevronLeft className="h-4 w-4 mr-1" /> Para
                    </Button>
                    <span className="text-sm text-muted-foreground px-4">
                      Faqja {meta.currentPage} nga {meta.totalPages}
                    </span>
                    <Button variant="outline" size="sm" disabled={meta.currentPage >= meta.totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}>
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
