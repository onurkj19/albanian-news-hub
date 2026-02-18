import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/constants";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-md font-black text-lg inline-block">
            {SITE_NAME}
          </div>
          <h1 className="text-7xl font-black text-primary">404</h1>
          <h2 className="text-xl font-bold text-foreground">Faqja nuk u gjet</h2>
          <p className="text-muted-foreground">
            Faqja që po kërkoni nuk ekziston ose është zhvendosur.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Kryefaqja
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/kerko">
              <Search className="h-4 w-4 mr-2" />
              Kërko
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
