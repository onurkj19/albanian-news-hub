import { trendingTopics } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

export function TrendingTopics() {
  return (
    <section className="bg-muted py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
          <TrendingUp className="h-5 w-5 text-primary mr-2" />
          <h2 className="text-xl font-bold text-foreground">Tema në Trend</h2>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {trendingTopics.map((topic, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors px-3 py-1"
            >
              #{topic}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}