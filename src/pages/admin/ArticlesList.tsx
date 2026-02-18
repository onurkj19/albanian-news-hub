import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus, Search, Pencil, Trash2, Eye, ChevronLeft, ChevronRight, Globe, Clock, FileText,
} from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";

interface ArticleItem {
  id: number; title: string; slug: string; status: string; views: number;
  featured: number; breaking: number; featured_image: string;
  category_name: string; author_name: string; updated_at: string;
}

const statusLabel: Record<string, string> = { draft: "Draft", published: "Publikuar", scheduled: "Planifikuar" };
const statusColor: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-live/10 text-live",
  scheduled: "bg-urgent/10 text-urgent",
};

export default function ArticlesList() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const fetchArticles = (page = 1) => {
    setLoading(true);
    const params: Record<string, string> = { page: String(page) };
    if (statusFilter) params.status = statusFilter;
    api.articles.adminList(params)
      .then((res) => {
        setArticles((res.data || []) as unknown as ArticleItem[]);
        if (res.meta) setMeta(res.meta as typeof meta);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchArticles(); }, [statusFilter]);

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Fshi artikullin: "${title}"?`)) return;
    try {
      await api.articles.delete(id);
      toast.success("Artikulli u fshi.");
      fetchArticles(meta.currentPage);
    } catch { toast.error("Gabim gjatë fshirjes."); }
  };

  const filtered = filter
    ? articles.filter((a) => a.title.toLowerCase().includes(filter.toLowerCase()))
    : articles;

  return (
    <AdminLayout title="Menaxhimi i Artikujve">
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filtro artikujt..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
          <div className="flex gap-1.5">
            {["", "published", "draft", "scheduled"].map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? "default" : "outline"}
                size="sm"
                className="h-9 text-xs"
                onClick={() => setStatusFilter(s)}
              >
                {s === "" ? "Të gjitha" : statusLabel[s] || s}
              </Button>
            ))}
          </div>
          <Button size="sm" className="h-9" asChild>
            <Link to="/admin/artikull/ri"><Plus className="h-3.5 w-3.5 mr-1" /> I Ri</Link>
          </Button>
        </div>

        {/* Articles List */}
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-3 animate-pulse"><div className="h-4 bg-muted rounded w-3/4" /></div>
              ))
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p>Nuk ka artikuj.</p>
              </div>
            ) : (
              filtered.map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors">
                  {a.featured_image && (
                    <img src={a.featured_image} alt="" className="w-12 h-12 rounded object-cover flex-shrink-0 hidden sm:block" />
                  )}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/admin/artikull/${a.id}/redakto`}
                      className="text-sm font-medium hover:text-primary transition-colors line-clamp-1"
                    >
                      {a.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                      <Badge className={`text-[10px] ${statusColor[a.status] || ""}`}>
                        {statusLabel[a.status] || a.status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{a.category_name}</span>
                      {a.featured === 1 && <Badge variant="outline" className="text-[10px]">E veçuar</Badge>}
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <Eye className="h-2.5 w-2.5" /> {a.views}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {a.status === "published" && (
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                        <Link to={`/artikull/${a.slug}`} target="_blank"><Globe className="h-3 w-3" /></Link>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                      <Link to={`/admin/artikull/${a.id}/redakto`}><Pencil className="h-3 w-3" /></Link>
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(a.id, a.title)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled={meta.currentPage <= 1} onClick={() => fetchArticles(meta.currentPage - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">{meta.currentPage} / {meta.totalPages}</span>
            <Button variant="outline" size="sm" disabled={meta.currentPage >= meta.totalPages} onClick={() => fetchArticles(meta.currentPage + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
