import { ArticleCard } from "@/components/articles/ArticleCard";
import { mockArticles } from "@/data/mockData";

export function FeaturedArticles() {
  const featuredArticle = mockArticles.find(article => article.featured);
  const regularArticles = mockArticles.filter(article => !article.featured).slice(0, 4);

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 auto-rows-min">
        {featuredArticle && (
          <div className="lg:col-span-2 lg:row-span-2">
            <ArticleCard {...featuredArticle} />
          </div>
        )}
        
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {regularArticles.map(article => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </div>
      </div>
    </section>
  );
}