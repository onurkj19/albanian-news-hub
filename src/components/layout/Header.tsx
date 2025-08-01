import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search, X, Sun, Moon, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navigationItems = [
  { name: "Kryesore", href: "/" },
  { name: "Lajmet e Fundit", href: "/lajmet-e-fundit" },
  { name: "Politikë", href: "/politike" },
  { name: "Ekonomi", href: "/ekonomi" },
  { name: "Sport", href: "/sport" },
  { name: "Showbiz", href: "/showbiz" },
  { name: "Shëndetësi", href: "/shendetesi" },
  { name: "Teknologji", href: "/teknologji" },
  { name: "Opinion", href: "/opinion" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Breaking News Ticker */}
      <div className="bg-breaking text-breaking-foreground py-1 px-4">
        <div className="container mx-auto flex items-center">
          <span className="text-sm font-semibold mr-4 whitespace-nowrap">LAJME TË FUNDIT:</span>
          <div className="overflow-hidden flex-1">
            <div className="animate-marquee whitespace-nowrap text-sm">
              Kryeministri diskuton masat e reja ekonomike • Rezultatet nga zgjedhjet lokale • Ndryshimet klimatike në Shqipëri
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded font-bold text-xl">
              ALNN
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-foreground">Albanian News Network</div>
              <div className="text-xs text-muted-foreground">Lajmet më të reja nga Shqipëria</div>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Kërko lajme..."
                className="pl-10 pr-4"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Tv className="h-4 w-4 mr-2" />
              LIVE TV
            </Button>
            
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:block border-t border-border">
          <div className="flex space-x-8 py-3">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium hover:text-primary transition-colors ${
                  location.pathname === item.href
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Kërko lajme..."
                  className="pl-10 pr-4"
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block py-2 px-3 rounded-md text-sm font-medium ${
                    location.pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/live-tv"
                className="block py-2 px-3 rounded-md text-sm font-medium text-foreground hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                <Tv className="h-4 w-4 mr-2 inline" />
                LIVE TV
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}