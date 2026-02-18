import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TRENDING_TOPICS } from "@/constants";

export function TrendingTopics() {
  if (TRENDING_TOPICS.length === 0) return null;

  return (
    <section className="bg-muted/50 py-4 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">Trending:</span>
          </div>
          <div className="flex gap-2">
            {TRENDING_TOPICS.map((topic) => (
              <Link key={topic} to={`/kerko?q=${encodeURIComponent(topic)}`}>
                <Badge
                  variant="secondary"
                  className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors whitespace-nowrap text-xs"
                >
                  {topic}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
