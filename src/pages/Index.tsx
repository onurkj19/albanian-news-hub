import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { FeaturedArticles } from "@/components/home/FeaturedArticles";
import { TrendingTopics } from "@/components/home/TrendingTopics";
import { ArticleCard, ArticleCardSkeleton } from "@/components/articles/ArticleCard";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/constants";
import { getLatestArticles } from "@/services/articleService";
import type { Article } from "@/types";

export default function Index() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestArticles(18)
      .then(setArticles)
      .finally(() => setLoading(false));
  }, []);

  const categoryPreviews = CATEGORIES.slice(0, 3).map((cat) => ({
    ...cat,
    articles: articles.filter((a) => a.categorySlug === cat.slug).slice(0, 2),
  }));

  return (
    <Layout>
      <FeaturedArticles />
      <TrendingTopics />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            {/* Latest News */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">Lajmet e Fundit</h2>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => <ArticleCardSkeleton key={i} />)}
                </div>
              ) : articles.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">Nuk ka artikuj aktualisht.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {articles.slice(0, 6).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </section>

            {/* Category Sections */}
            {categoryPreviews
              .filter((cp) => cp.articles.length > 0)
              .map((cp) => (
                <section key={cp.slug}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground">{cp.name}</h2>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/${cp.slug}`} className="text-primary">
                        Shiko të gjitha
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cp.articles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </section>
              ))}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-32">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
