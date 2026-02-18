import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ArticleCard, ArticleCardSkeleton } from "@/components/articles/ArticleCard";
import { CommentSection } from "@/components/articles/CommentSection";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Badge } from "@/components/ui/badge";
import { LazyImage } from "@/components/common/LazyImage";
import { Clock, Eye, User, Calendar, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getArticleBySlug, getRelatedArticles } from "@/services/articleService";
import { toast } from "sonner";
import NotFound from "./NotFound";
import type { Article } from "@/types";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("sq-AL", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function formatViews(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) { setNotFound(true); return; }
    setLoading(true);
    getArticleBySlug(slug)
      .then((a) => {
        if (!a) { setNotFound(true); return; }
        setArticle(a);
        return getRelatedArticles(a, 4);
      })
      .then((r) => { if (r) setRelated(r); })
      .finally(() => setLoading(false));
  }, [slug]);

  if (notFound) return <NotFound />;

  if (loading || !article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
            <div className="h-6 bg-muted rounded w-1/3" />
            <div className="h-10 bg-muted rounded w-3/4" />
            <div className="h-5 bg-muted rounded w-1/2" />
            <div className="aspect-video bg-muted rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Linku u kopjua!");
    }
  };

  return (
    <Layout>
      <article className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">Kryefaqja</Link>
              <span>/</span>
              <Link to={`/${article.categorySlug}`} className="hover:text-primary transition-colors">
                {article.category}
              </Link>
            </div>

            {/* Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{article.category}</Badge>
                {article.breaking && <Badge className="bg-breaking text-breaking-foreground">BREAKING</Badge>}
                {article.urgent && <Badge className="bg-urgent text-urgent-foreground">URGJENT</Badge>}
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                {article.title}
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">{article.excerpt}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span className="font-medium text-foreground">{article.author.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  <span>{formatViews(article.views)} lexime</span>
                </div>
              </div>
            </div>

            {article.imageUrl && (
              <div className="rounded-xl overflow-hidden">
                <LazyImage src={article.imageUrl} alt={article.title} aspectRatio="video" />
              </div>
            )}

            <div className="article-content text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }} />

            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4">
                <span className="text-sm font-medium text-muted-foreground">Etiketat:</span>
                {article.tags.map((tag) => (
                  <Link key={tag} to={`/kerko?q=${encodeURIComponent(tag)}`}>
                    <Badge variant="outline" className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors">
                      #{tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm font-medium text-muted-foreground">Ndaj:</span>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-3.5 w-3.5 mr-1.5" /> Kopjo linkun
              </Button>
            </div>

            <Separator />

            {related.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">Artikuj të ngjashëm</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {related.map((a) => <ArticleCard key={a.id} article={a} variant="compact" />)}
                </div>
              </section>
            )}

            <Separator />
            <CommentSection articleId={article.id} />
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-32"><Sidebar /></div>
          </div>
        </div>
      </article>
    </Layout>
  );
}
