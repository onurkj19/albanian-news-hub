import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Trash2, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";

interface CommentItem {
  id: number; article_id: number; author_name: string; author_email: string;
  content: string; status: string; likes: number; created_at: string;
  article_title: string;
}

const statusLabel: Record<string, string> = { pending: "Në Pritje", approved: "Aprovuar", rejected: "Refuzuar" };
const statusColor: Record<string, string> = {
  pending: "bg-urgent/10 text-urgent",
  approved: "bg-live/10 text-live",
  rejected: "bg-destructive/10 text-destructive",
};

export default function CommentsManager() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchComments = (page = 1) => {
    setLoading(true);
    const params: Record<string, string> = { page: String(page) };
    if (filter) params.status = filter;
    api.comments.adminList(params)
      .then((res) => {
        setComments((res.data || []) as unknown as CommentItem[]);
        if (res.meta) setMeta(res.meta as typeof meta);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchComments(); }, [filter]);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await api.comments.updateStatus(id, status);
      toast.success(status === "approved" ? "Komenti u aprovua." : "Komenti u refuzua.");
      fetchComments(meta.currentPage);
    } catch { toast.error("Gabim."); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Fshi këtë koment?")) return;
    try {
      await api.comments.delete(id);
      toast.success("Komenti u fshi.");
      fetchComments(meta.currentPage);
    } catch { toast.error("Gabim gjatë fshirjes."); }
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("sq-AL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <AdminLayout title="Menaxhimi i Komenteve">
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex gap-1.5">
          {["", "pending", "approved", "rejected"].map((s) => (
            <Button
              key={s}
              variant={filter === s ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setFilter(s)}
            >
              {s === "" ? "Të gjitha" : statusLabel[s] || s}
              {s === "pending" && meta.totalItems > 0 && (
                <span className="ml-1 bg-primary/20 text-primary px-1 rounded text-[10px]">
                  {comments.filter(c => c.status === "pending").length}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Comments List */}
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-3 animate-pulse"><div className="h-4 bg-muted rounded w-2/3" /></div>
              ))
            ) : comments.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p>Nuk ka komente.</p>
              </div>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{c.author_name}</span>
                        <Badge className={`text-[10px] ${statusColor[c.status] || ""}`}>
                          {statusLabel[c.status] || c.status}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{formatDate(c.created_at)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Në: <span className="text-foreground">{c.article_title}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-foreground/90 bg-muted/30 p-2 rounded">{c.content}</p>

                  <div className="flex items-center gap-1">
                    {c.status !== "approved" && (
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-live" onClick={() => handleStatusChange(c.id, "approved")}>
                        <CheckCircle className="h-3 w-3 mr-1" /> Aprovo
                      </Button>
                    )}
                    {c.status !== "rejected" && (
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => handleStatusChange(c.id, "rejected")}>
                        <XCircle className="h-3 w-3 mr-1" /> Refuzo
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="h-3 w-3 mr-1" /> Fshi
                    </Button>
                    <span className="text-[10px] text-muted-foreground ml-auto">{c.likes} pëlqime</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled={meta.currentPage <= 1} onClick={() => fetchComments(meta.currentPage - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">{meta.currentPage} / {meta.totalPages}</span>
            <Button variant="outline" size="sm" disabled={meta.currentPage >= meta.totalPages} onClick={() => fetchComments(meta.currentPage + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
