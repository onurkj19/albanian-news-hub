import { useState, useEffect } from "react";
import { ArticleCard, ArticleCardSkeleton } from "@/components/articles/ArticleCard";
import { getFeaturedArticles, getLatestArticles } from "@/services/articleService";
import type { Article } from "@/types";

export function FeaturedArticles() {
  const [featured, setFeatured] = useState<Article[]>([]);
  const [latest, setLatest] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getFeaturedArticles(), getLatestArticles(4)])
      .then(([f, l]) => {
        setFeatured(f);
        setLatest(l.filter((a) => !f.some((fa) => fa.id === a.id)));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-4 pt-6 pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2"><ArticleCardSkeleton /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <ArticleCardSkeleton /><ArticleCardSkeleton />
          </div>
        </div>
      </section>
    );
  }

  const mainFeatured = featured[0];
  if (!mainFeatured) return null;

  const secondaryFeatured = featured.slice(1, 3);

  return (
    <section className="container mx-auto px-4 pt-6 pb-2">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ArticleCard article={mainFeatured} variant="featured" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {secondaryFeatured.length > 0
            ? secondaryFeatured.map((article) => (
                <ArticleCard key={article.id} article={article} variant="default" />
              ))
            : latest.slice(0, 2).map((article) => (
                <ArticleCard key={article.id} article={article} variant="default" />
              ))}
        </div>
      </div>
    </section>
  );
}
