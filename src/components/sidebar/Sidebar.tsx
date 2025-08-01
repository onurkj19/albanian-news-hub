import { categories, mockArticles } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";

export function Sidebar() {
  const latestArticles = mockArticles.slice(0, 3);

  return (
    <aside className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Kategoritë</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/${category.slug}`}
              className="flex items-center justify-between hover:text-primary transition-colors group"
            >
              <span className="text-sm font-medium">{category.name}</span>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
                <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Latest Articles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Më të Rejat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {latestArticles.map((article) => (
            <Link
              key={article.id}
              to={`/artikull/${article.id}`}
              className="block group"
            >
              <div className="flex space-x-3">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-16 h-16 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <span>{article.publishedAt}</span>
                    <span className="mx-1">•</span>
                    <span>{article.category}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Weather Widget */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Moti në Tiranë</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">22°C</div>
            <div className="text-sm text-muted-foreground">I kthjellët</div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="font-medium">Nesër</div>
                <div className="text-muted-foreground">24°C</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Pasnesër</div>
                <div className="text-muted-foreground">21°C</div>
              </div>
              <div className="text-center">
                <div className="font-medium">E premte</div>
                <div className="text-muted-foreground">19°C</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advertisement Space */}
      <Card>
        <CardContent className="p-4">
          <div className="bg-muted rounded-lg h-32 flex items-center justify-center text-muted-foreground text-sm">
            Hapësirë Reklamuese
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}