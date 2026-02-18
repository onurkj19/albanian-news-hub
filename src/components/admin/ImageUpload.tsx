import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Imazhi Kryesor" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Skedari është shumë i madh. Maksimumi është 5MB.");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    try {
      const res = await api.media.upload(file);
      if (res.success && res.data) {
        onChange(res.data.url);
        setPreview(res.data.url);
        toast.success("Imazhi u ngarkua me sukses!");
      }
    } catch (err) {
      toast.error("Gabim gjatë ngarkimit të imazhit.");
      setPreview(value);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    setPreview("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-border group">
          <img
            src={preview}
            alt="Preview"
            className="w-full aspect-video object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ndrysho"}
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="w-full aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
          ) : (
            <>
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-sm text-muted-foreground">Klikoni ose tërhiqni për të ngarkuar</div>
              <div className="text-xs text-muted-foreground/60">JPG, PNG, WebP (max 5MB)</div>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
