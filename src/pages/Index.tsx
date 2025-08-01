import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FeaturedArticles } from "@/components/home/FeaturedArticles";
import { TrendingTopics } from "@/components/home/TrendingTopics";
import { Sidebar } from "@/components/sidebar/Sidebar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <FeaturedArticles />
        <TrendingTopics />
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Lajmet e Fundit</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Additional news articles would go here */}
                  <div className="text-center py-12 text-muted-foreground">
                    Më shumë lajme do të shtohen së shpejti...
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
