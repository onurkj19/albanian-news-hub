import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

import Index from "./pages/Index";

const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const ArticlesList = lazy(() => import("./pages/admin/ArticlesList"));
const ArticleEditor = lazy(() => import("./pages/admin/ArticleEditor"));
const CommentsManager = lazy(() => import("./pages/admin/CommentsManager"));
const MediaLibrary = lazy(() => import("./pages/admin/MediaLibrary"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 },
  },
});

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Duke u ngarkuar...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public */}
                  <Route path="/" element={<Index />} />
                  <Route path="/:slug" element={<CategoryPage />} />
                  <Route path="/artikull/:slug" element={<ArticleDetail />} />
                  <Route path="/kerko" element={<SearchResults />} />
                  <Route path="/hyrje" element={<Login />} />

                  {/* Admin */}
                  <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/artikuj" element={<ProtectedRoute><ArticlesList /></ProtectedRoute>} />
                  <Route path="/admin/artikull/ri" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />
                  <Route path="/admin/artikull/:id/redakto" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />
                  <Route path="/admin/komentet" element={<ProtectedRoute><CommentsManager /></ProtectedRoute>} />
                  <Route path="/admin/media" element={<ProtectedRoute><MediaLibrary /></ProtectedRoute>} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
            <Toaster position="top-right" richColors closeButton />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
