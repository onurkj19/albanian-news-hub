import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, Loader2, Eye, Send, Clock } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";

interface CategoryOption {
  id: number;
  name: string;
  slug: string;
}

export default function ArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const numericId = id ? parseInt(id) : 0;

  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    featured_image: "",
    category_id: 0,
    status: "draft" as "draft" | "published" | "scheduled",
    scheduled_at: "",
    meta_title: "",
    meta_description: "",
    og_image: "",
    featured: false,
    urgent: false,
    breaking: false,
    read_time: "3 min lexim",
    tags: [] as string[],
  });
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    api.dashboard.categories().then((res) => {
      if (res.data) setCategories(res.data as unknown as CategoryOption[]);
    });
  }, []);

  useEffect(() => {
    if (isEditing && numericId) {
      api.articles.adminGet(numericId).then((res) => {
        if (res.data) {
          const a = res.data as Record<string, unknown>;
          const tags = (a.tags as { name: string }[] || []).map((t) => t.name);
          setForm({
            title: (a.title as string) || "",
            excerpt: (a.excerpt as string) || "",
            content: (a.content as string) || "",
            featured_image: (a.featured_image as string) || "",
            category_id: (a.category_id as number) || 0,
            status: (a.status as "draft" | "published" | "scheduled") || "draft",
            scheduled_at: (a.scheduled_at as string) || "",
            meta_title: (a.meta_title as string) || "",
            meta_description: (a.meta_description as string) || "",
            og_image: (a.og_image as string) || "",
            featured: !!(a.featured as number),
            urgent: !!(a.urgent as number),
            breaking: !!(a.breaking as number),
            read_time: (a.read_time as string) || "3 min lexim",
            tags,
          });
          setTagsInput(tags.join(", "));
        }
      }).catch(() => {
        toast.error("Artikulli nuk u gjet.");
        navigate("/admin/artikuj");
      });
    }
  }, [numericId, isEditing, navigate]);

  const handleChange = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (saveAs?: "draft" | "published" | "scheduled") => {
    if (!form.title) { toast.error("Titulli kërkohet."); return; }

    const status = saveAs || form.status;
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);

    setIsLoading(true);
    try {
      const data = { ...form, status, tags, category_id: form.category_id || undefined };
      if (isEditing && numericId) {
        await api.articles.update(numericId, data);
        toast.success("Artikulli u përditësua!");
      } else {
        await api.articles.create(data);
        toast.success("Artikulli u krijua!");
      }
      navigate("/admin/artikuj");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gabim gjatë ruajtjes.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout title={isEditing ? "Redakto Artikullin" : "Artikull i Ri"}>
      <div className="max-w-4xl space-y-4">
        {/* Title */}
        <Input
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Titulli i artikullit..."
          className="text-lg font-semibold h-12"
        />

        {/* Excerpt */}
        <textarea
          value={form.excerpt}
          onChange={(e) => handleChange("excerpt", e.target.value)}
          placeholder="Përmbledhja e shkurtër..."
          rows={2}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
        />

        {/* Rich Text Editor */}
        <RichTextEditor
          content={form.content}
          onChange={(html) => handleChange("content", html)}
          placeholder="Shkruani përmbajtjen e artikullit..."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Image + Metadata */}
          <div className="lg:col-span-2 space-y-4">
            <ImageUpload
              value={form.featured_image}
              onChange={(url) => handleChange("featured_image", url)}
            />

            {/* SEO Settings */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">SEO & Meta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Meta Titulli</Label>
                  <Input
                    value={form.meta_title}
                    onChange={(e) => handleChange("meta_title", e.target.value)}
                    placeholder={form.title || "Titulli për motorët e kërkimit"}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Meta Përshkrimi</Label>
                  <textarea
                    value={form.meta_description}
                    onChange={(e) => handleChange("meta_description", e.target.value)}
                    placeholder={form.excerpt || "Përshkrimi për motorët e kërkimit"}
                    rows={2}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {(form.meta_description || form.excerpt || "").length}/160 karaktere
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Settings */}
          <div className="space-y-4">
            {/* Category */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Detajet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Kategoria</Label>
                  <select
                    value={form.category_id}
                    onChange={(e) => handleChange("category_id", parseInt(e.target.value))}
                    className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value={0}>Zgjidhni kategorinë</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-xs">Etiketat</Label>
                  <Input
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="politikë, ekonomi"
                    className="h-8 text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs">Koha e Leximit</Label>
                  <Input
                    value={form.read_time}
                    onChange={(e) => handleChange("read_time", e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>

                {/* Flags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    { key: "featured", label: "E veçuar" },
                    { key: "urgent", label: "Urgjente" },
                    { key: "breaking", label: "Breaking" },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleChange(key, !form[key as keyof typeof form])}
                    >
                      <Badge
                        variant={form[key as keyof typeof form] ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                      >
                        {label}
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scheduling */}
            {form.status === "scheduled" && (
              <Card>
                <CardContent className="p-3">
                  <Label className="text-xs">Data e publikimit</Label>
                  <Input
                    type="datetime-local"
                    value={form.scheduled_at ? form.scheduled_at.slice(0, 16) : ""}
                    onChange={(e) => handleChange("scheduled_at", e.target.value)}
                    className="h-8 text-sm"
                  />
                </CardContent>
              </Card>
            )}

            {/* Publish Actions */}
            <Card>
              <CardContent className="p-3 space-y-2">
                <Button
                  className="w-full"
                  onClick={() => handleSubmit("published")}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Send className="h-4 w-4 mr-1" />}
                  Publiko
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSubmit("draft")}
                    disabled={isLoading}
                  >
                    <Save className="h-3.5 w-3.5 mr-1" /> Draft
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { handleChange("status", "scheduled"); }}
                    disabled={isLoading}
                  >
                    <Clock className="h-3.5 w-3.5 mr-1" /> Planifiko
                  </Button>
                </div>
                {isEditing && form.status === "published" && (
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <a href={`/artikull/${form.title}`} target="_blank">
                      <Eye className="h-3.5 w-3.5 mr-1" /> Shiko në faqe
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
