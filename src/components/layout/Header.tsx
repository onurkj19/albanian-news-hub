import { useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, X, Sun, Moon, LogIn, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { NAVIGATION_ITEMS, SITE_NAME, SITE_FULL_NAME, SITE_TAGLINE, BREAKING_NEWS } from "@/constants";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = searchQuery.trim();
      if (trimmed) {
        navigate(`/kerko?q=${encodeURIComponent(trimmed)}`);
        setSearchQuery("");
        setIsSearchOpen(false);
        setIsMenuOpen(false);
      }
    },
    [searchQuery, navigate]
  );

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const breakingText = BREAKING_NEWS.map((n) => n.text).join("  •  ");

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      {/* Breaking News Ticker */}
      {BREAKING_NEWS.length > 0 && (
        <div className="bg-breaking text-breaking-foreground">
          <div className="container mx-auto flex items-center h-8 overflow-hidden">
            <span className="text-xs font-bold mr-3 whitespace-nowrap px-2 py-0.5 bg-white/20 rounded">
              LAJME
            </span>
            <div className="overflow-hidden flex-1 relative">
              <div className="animate-marquee whitespace-nowrap text-xs font-medium">
                {breakingText}  •  {breakingText}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-primary text-primary-foreground px-2.5 py-1 rounded-md font-black text-lg tracking-tight">
              {SITE_NAME}
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-foreground leading-tight">{SITE_FULL_NAME}</div>
              <div className="text-[10px] text-muted-foreground leading-tight">{SITE_TAGLINE}</div>
            </div>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Kërko lajme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 h-9 bg-muted/50"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => { setIsSearchOpen(!isSearchOpen); setIsMenuOpen(false); }}
              aria-label="Kërko"
            >
              <Search className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
              aria-label={theme === "dark" ? "Ndriço" : "Errëso"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {isAuthenticated ? (
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <Link to="/admin">
                  <LayoutDashboard className="h-4 w-4 mr-1.5" />
                  Admin
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <Link to="/hyrje">
                  <LogIn className="h-4 w-4 mr-1.5" />
                  Hyrje
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => { setIsMenuOpen(!isMenuOpen); setIsSearchOpen(false); }}
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block border-t border-border/50">
          <div className="flex items-center gap-1 py-1 -mx-2 overflow-x-auto">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  isActive(item.href)
                    ? "text-primary bg-primary/5"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Search Dropdown */}
      {isSearchOpen && (
        <div className="lg:hidden bg-background border-t border-border px-4 py-3 animate-slide-in">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Kërko lajme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4"
                autoFocus
              />
            </div>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border animate-slide-in">
          <div className="container mx-auto px-4 py-3">
            <nav className="space-y-1">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-border mt-2">
                {isAuthenticated ? (
                  <Link
                    to="/admin"
                    className="block py-2 px-3 rounded-md text-sm font-medium text-foreground hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2 inline" />
                    Paneli Admin
                  </Link>
                ) : (
                  <Link
                    to="/hyrje"
                    className="block py-2 px-3 rounded-md text-sm font-medium text-foreground hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4 mr-2 inline" />
                    Hyrje
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
