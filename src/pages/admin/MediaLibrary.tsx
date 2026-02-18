import { useEffect, useState, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Image as ImageIcon, Loader2, Copy, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";

interface MediaItem {
  id: number; filename: string; original_name: string; path: string;
  size: number; width: number; height: number; created_at: string;
}

export default function MediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = (page = 1) => {
    setLoading(true);
    api.media.list({ page: String(page) })
      .then((res) => {
        setMedia((res.data || []) as unknown as MediaItem[]);
        if (res.meta) setMeta(res.meta as typeof meta);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMedia(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;
    for (const file of Array.from(files)) {
      try {
        await api.media.upload(file);
        successCount++;
      } catch { /* skip failed */ }
    }

    if (successCount > 0) {
      toast.success(`${successCount} imazh/e u ngarkuan me sukses.`);
      fetchMedia();
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Fshi këtë imazh?")) return;
    try {
      await api.media.delete(id);
      toast.success("Imazhi u fshi.");
      fetchMedia(meta.currentPage);
    } catch { toast.error("Gabim."); }
  };

  const copyUrl = (path: string) => {
    navigator.clipboard.writeText(window.location.origin + path);
    toast.success("URL u kopjua!");
  };

  const fmtSize = (bytes: number) =>
    bytes > 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;

  return (
    <AdminLayout title="Libraria e Medias">
      <div className="space-y-4">
        {/* Upload */}
        <div className="flex items-center gap-2">
          <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
            Ngarko Imazhe
          </Button>
          <span className="text-xs text-muted-foreground">{meta.totalItems} imazhe gjithsej</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : media.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ImageIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
              <p className="text-muted-foreground">Nuk ka imazhe. Ngarkoni imazhin e parë.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {media.map((m) => (
              <div key={m.id} className="group relative rounded-lg overflow-hidden border border-border bg-card">
                <img src={m.path} alt={m.original_name} className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => copyUrl(m.path)}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(m.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="p-1.5">
                  <p className="text-[10px] text-muted-foreground truncate">{m.original_name}</p>
                  <p className="text-[10px] text-muted-foreground/60">{fmtSize(m.size)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled={meta.currentPage <= 1} onClick={() => fetchMedia(meta.currentPage - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">{meta.currentPage} / {meta.totalPages}</span>
            <Button variant="outline" size="sm" disabled={meta.currentPage >= meta.totalPages} onClick={() => fetchMedia(meta.currentPage + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
