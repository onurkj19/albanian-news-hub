import { Link } from "react-router-dom";
import { Clock, User, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  views: number;
  featured?: boolean;
  urgent?: boolean;
}

export function ArticleCard({
  id,
  title,
  excerpt,
  imageUrl,
  category,
  author,
  publishedAt,
  readTime,
  views,
  featured = false,
  urgent = false,
}: ArticleCardProps) {
  return (
    <article className={`group ${featured ? "col-span-2 row-span-2" : ""}`}>
      <Link to={`/artikull/${id}`} className="block h-full">
        <div className={`bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full ${
          featured ? "h-full" : ""
        }`}>
          <div className="relative">
            <img
              src={imageUrl}
              alt={title}
              className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                featured ? "h-64 md:h-80" : "h-48"
              }`}
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge variant="secondary" className="text-xs font-medium">
                {category}
              </Badge>
              {urgent && (
                <Badge className="bg-urgent text-urgent-foreground text-xs font-medium">
                  URGJENT
                </Badge>
              )}
            </div>
          </div>
          
          <div className={`p-4 ${featured ? "p-6" : ""}`}>
            <h3 className={`font-bold text-card-foreground group-hover:text-primary transition-colors ${
              featured ? "text-xl md:text-2xl mb-3" : "text-lg mb-2"
            }`}>
              {title}
            </h3>
            
            <p className={`text-muted-foreground mb-4 ${
              featured ? "text-base" : "text-sm line-clamp-2"
            }`}>
              {excerpt}
            </p>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{readTime}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{views.toLocaleString()}</span>
                </div>
                <span>{publishedAt}</span>
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
      <div className="bg-card rounded-lg overflow-hidden shadow-sm h-full">
        <div className="bg-muted h-48 w-full"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded"></div>
            <div className="h-3 bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </article>
  );
}