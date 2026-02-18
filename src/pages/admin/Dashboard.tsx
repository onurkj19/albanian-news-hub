import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText, Eye, MessageSquare, Image, TrendingUp,
  Clock, Plus, ArrowRight, Zap,
} from "lucide-react";
import { api } from "@/services/api";

interface DashboardData {
  stats: {
    totalArticles: number; published: number; drafts: number; scheduled: number;
    totalViews: number; totalComments: number; pendingComments: number; totalMedia: number;
  };
  recentArticles: { id: number; title: string; status: string; views: number; updated_at: string; category_name: string; author_name: string }[];
  topArticles: { id: number; title: string; views: number; category_name: string }[];
  categoryCounts: { name: string; count: number }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dashboard.stats()
      .then((res) => { if (res.data) setData(res.data as unknown as DashboardData); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fmtViews = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

  const statusLabel: Record<string, string> = { draft: "Draft", published: "Publikuar", scheduled: "Planifikuar" };
  const statusColor: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    published: "bg-live/10 text-live",
    scheduled: "bg-urgent/10 text-urgent",
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4 h-20 animate-pulse bg-muted/30" /></Card>
          ))}
        </div>
      </AdminLayout>
    );
  }

  const s = data?.stats;

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Artikuj", value: s?.totalArticles ?? 0, icon: FileText, color: "text-primary", sub: `${s?.published ?? 0} publikuar` },
            { label: "Lexime", value: fmtViews(s?.totalViews ?? 0), icon: Eye, color: "text-blue-500", sub: "gjithsej" },
            { label: "Komentet", value: s?.totalComments ?? 0, icon: MessageSquare, color: "text-green-500", sub: `${s?.pendingComments ?? 0} në pritje` },
            { label: "Draft", value: s?.drafts ?? 0, icon: Clock, color: "text-orange-500", sub: `${s?.scheduled ?? 0} planifikuar` },
          ].map(({ label, value, icon: Icon, color, sub }) => (
            <Card key={label}>
              <CardContent className="p-3 flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted flex-shrink-0 ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-bold text-foreground">{value}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link to="/admin/artikull/ri"><Plus className="h-3.5 w-3.5 mr-1" /> Artikull i Ri</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link to="/admin/artikuj">Menaxho Artikujt <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
          </Button>
          {(s?.pendingComments ?? 0) > 0 && (
            <Button size="sm" variant="outline" asChild>
              <Link to="/admin/komentet">
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                {s?.pendingComments} komentet në pritje
              </Link>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Articles */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                Artikujt e Fundit
                <Link to="/admin/artikuj" className="text-xs text-primary font-normal">Shiko të gjitha</Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {data?.recentArticles?.map((a) => (
                <Link
                  key={a.id}
                  to={`/admin/artikull/${a.id}/redakto`}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{a.title}</p>
                    <p className="text-[10px] text-muted-foreground">{a.category_name} · {a.author_name}</p>
                  </div>
                  <Badge className={`text-[10px] ml-2 flex-shrink-0 ${statusColor[a.status] || ""}`}>
                    {statusLabel[a.status] || a.status}
                  </Badge>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Top Articles */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" /> Më të Lexuarat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {data?.topArticles?.map((a, i) => (
                <div key={a.id} className="flex items-center gap-3 p-2">
                  <span className="text-lg font-bold text-muted-foreground/30 w-5 text-right flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{a.title}</p>
                    <p className="text-[10px] text-muted-foreground">{a.category_name}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                    <Eye className="h-3 w-3" /> {fmtViews(a.views)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Artikujt sipas Kategorisë</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data?.categoryCounts?.map((c) => (
                  <Badge key={c.name} variant="secondary" className="text-xs">
                    {c.name}: {c.count}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
