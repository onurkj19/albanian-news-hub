import { type ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SITE_NAME } from "@/constants";
import { toast } from "sonner";
import {
  LayoutDashboard, FileText, MessageSquare, Image, LogOut,
  Home, Sun, Moon, Menu, X, Plus,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/artikuj", label: "Artikujt", icon: FileText },
  { href: "/admin/komentet", label: "Komentet", icon: MessageSquare },
  { href: "/admin/media", label: "Media", icon: Image },
];

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Jeni çkyçur me sukses.");
  };

  const isActive = (href: string) =>
    href === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between h-12 px-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <Link to="/admin" className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground px-1.5 py-0.5 rounded text-xs font-black">
                {SITE_NAME}
              </div>
              <span className="text-xs font-medium text-muted-foreground hidden sm:inline">Admin</span>
            </Link>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
              <Link to="/admin/artikull/ri">
                <Plus className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">Artikull i Ri</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link to="/"><Home className="h-3.5 w-3.5" /></Link>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogout}>
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - desktop always visible, mobile toggled */}
        <aside
          className={`
            fixed md:sticky top-12 left-0 z-40 h-[calc(100vh-3rem)] w-56 bg-card border-r border-border
            transition-transform duration-200 md:translate-x-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="p-3 space-y-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive(href)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border">
            <div className="text-xs text-muted-foreground truncate">
              {user?.name}
            </div>
            <div className="text-[10px] text-muted-foreground/60 truncate">
              {user?.email}
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-3rem)] p-4 md:p-6">
          {title && (
            <h1 className="text-xl font-bold text-foreground mb-4">{title}</h1>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
