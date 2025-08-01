import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { mockArticles } from "@/data/mockData";

const Politike = () => {
  const politikaArticles = mockArticles.filter(article => article.category === "Politikë");
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Politikë</h1>
              <p className="text-muted-foreground">Lajmet më të reja nga bota e politikës shqiptare dhe ndërkombëtare</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {politikaArticles.map(article => (
                <ArticleCard key={article.id} {...article} />
              ))}
              
              {/* Placeholder for more articles */}
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg p-6 text-center text-muted-foreground">
                  Më shumë artikuj të politikës do të shtohen së shpejti...
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Politike;