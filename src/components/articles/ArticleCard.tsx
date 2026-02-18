import { Link } from "react-router-dom";
import { Clock, Eye, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LazyImage } from "@/components/common/LazyImage";
import type { Article } from "@/types";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "featured" | "compact" | "horizontal";
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const { title, slug, excerpt, imageUrl, category, author, readTime, views, urgent, breaking } =
    article;

  const formatViews = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  if (variant === "horizontal") {
    return (
      <article className="group animate-fade-in">
        <Link to={`/artikull/${slug}`} className="flex gap-4">
          <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            <LazyImage src={imageUrl} alt={title} className="w-full h-full" aspectRatio="square" />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {category}
            </Badge>
            <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{readTime}</span>
              <span>·</span>
              <span>{formatViews(views)} lexime</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group animate-fade-in">
        <Link to={`/artikull/${slug}`} className="block">
          <div className="relative rounded-lg overflow-hidden">
            <LazyImage src={imageUrl} alt={title} className="group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute top-2 left-2 flex gap-1.5">
              <Badge variant="secondary" className="text-[10px] bg-background/90 backdrop-blur-sm">
                {category}
              </Badge>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground">{readTime}</p>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "featured") {
    return (
      <article className="group animate-fade-in">
        <Link to={`/artikull/${slug}`} className="block h-full">
          <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
            <div className="relative">
              <LazyImage
                src={imageUrl}
                alt={title}
                className="group-hover:scale-105 transition-transform duration-500"
                aspectRatio="wide"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 flex gap-2">
                {breaking && (
                  <Badge className="bg-breaking text-breaking-foreground text-xs font-bold animate-pulse">
                    BREAKING
                  </Badge>
                )}
                {urgent && (
                  <Badge className="bg-urgent text-urgent-foreground text-xs font-bold">
                    URGJENT
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs bg-background/90 backdrop-blur-sm">
                  {category}
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-3">
                  {title}
                </h2>
                <p className="text-white/80 text-sm line-clamp-2 hidden sm:block">
                  {excerpt}
                </p>
              </div>
            </div>
            <div className="p-4 mt-auto">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{author.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{readTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{formatViews(views)}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group animate-fade-in">
      <Link to={`/artikull/${slug}`} className="block h-full">
        <div
          className={cn(
            "bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col border border-transparent hover:border-border"
          )}
        >
          <div className="relative overflow-hidden">
            <LazyImage
              src={imageUrl}
              alt={title}
              className="group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge variant="secondary" className="text-xs bg-background/90 backdrop-blur-sm font-medium">
                {category}
              </Badge>
              {urgent && (
                <Badge className="bg-urgent text-urgent-foreground text-xs font-medium">
                  URGJENT
                </Badge>
              )}
              {breaking && (
                <Badge className="bg-breaking text-breaking-foreground text-xs font-bold animate-pulse">
                  BREAKING
                </Badge>
              )}
            </div>
          </div>

          <div className="p-4 flex flex-col flex-1">
            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2 text-base">
              {title}
            </h3>

            <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
              {excerpt}
            </p>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{author.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{readTime}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{formatViews(views)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function ArticleCardSkeleton() {
  return (
    <article className="animate-pulse">
      <div className="bg-card rounded-xl overflow-hidden shadow-sm h-full">
        <div className="bg-muted aspect-video w-full" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-muted rounded w-20" />
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="h-5 bg-muted rounded w-1/2" />
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-muted rounded" />
            <div className="h-3 bg-muted rounded w-5/6" />
          </div>
        </div>
      </div>
    </article>
  );
}
