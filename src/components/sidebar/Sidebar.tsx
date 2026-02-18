import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsletterForm } from "@/components/common/NewsletterForm";
import { CATEGORIES, TRENDING_TOPICS } from "@/constants";
import { getLatestArticles } from "@/services/articleService";
import type { Article } from "@/types";

export function Sidebar() {
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);

  useEffect(() => {
    getLatestArticles(5).then(setLatestArticles);
  }, []);

  return (
    <aside className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Kategoritë</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              to={`/${category.slug}`}
              className="flex items-center justify-between py-1.5 hover:text-primary transition-colors group"
            >
              <span className="text-sm">{category.name}</span>
              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Latest Articles */}
      {latestArticles.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Më të Rejat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {latestArticles.map((article, index) => (
              <Link
                key={article.id}
                to={`/artikull/${article.slug}`}
                className="flex gap-3 group"
              >
                <span className="text-2xl font-bold text-muted-foreground/30 leading-none flex-shrink-0 w-6 text-right">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span>{article.readTime}</span>
                    <span>·</span>
                    <span>{article.category}</span>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Trending Topics */}
      {TRENDING_TOPICS.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tema në Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TOPICS.slice(0, 8).map((topic) => (
                <Link key={topic} to={`/kerko?q=${encodeURIComponent(topic)}`}>
                  <Badge
                    variant="secondary"
                    className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors text-xs"
                  >
                    #{topic}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <NewsletterForm variant="card" />
    </aside>
  );
}
