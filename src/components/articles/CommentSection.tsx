import { useState, useEffect } from "react";
import { MessageSquare, ThumbsUp, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { api } from "@/services/api";

interface CommentData {
  id: number;
  author_name: string;
  content: string;
  created_at: string;
  likes: number;
}

interface CommentSectionProps {
  articleId: string;
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");

  useEffect(() => {
    const numericId = parseInt(articleId);
    if (!numericId) return;
    api.comments.forArticle(numericId)
      .then((res) => setComments((res.data || []) as CommentData[]))
      .catch(() => {});
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) {
      toast.error("Ju lutem plotësoni emrin dhe komentin.");
      return;
    }

    try {
      await api.comments.post({
        article_id: parseInt(articleId),
        author_name: authorName.trim(),
        content: newComment.trim(),
      });
      toast.success("Komenti u dërgua për aprovim!");
      setNewComment("");
    } catch {
      toast.error("Gabim gjatë dërgimit të komentit.");
    }
  };

  const handleLike = async (commentId: number) => {
    await api.comments.like(commentId);
    setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Tani";
    if (diffMins < 60) return `${diffMins} min më parë`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} orë më parë`;
    return `${Math.floor(diffHours / 24)} ditë më parë`;
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">
          Komentet ({comments.length})
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="h-4 w-4 text-primary" />
          </div>
          <Input placeholder="Emri juaj" value={authorName}
            onChange={(e) => setAuthorName(e.target.value)} className="flex-1" />
        </div>
        <div className="flex gap-2">
          <Input placeholder="Shkruani komentin tuaj..." value={newComment}
            onChange={(e) => setNewComment(e.target.value)} className="flex-1" />
          <Button type="submit" size="icon"><Send className="h-4 w-4" /></Button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Bëhuni i pari që komenton këtë artikull.
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="animate-fade-in">
              <div className="flex gap-3">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">{comment.author_name}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="text-sm text-foreground/90">{comment.content}</p>
                  <button onClick={() => handleLike(comment.id)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <ThumbsUp className="h-3 w-3" />
                    <span>{comment.likes > 0 ? comment.likes : "Pëlqe"}</span>
                  </button>
                </div>
              </div>
              <Separator className="mt-4" />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
