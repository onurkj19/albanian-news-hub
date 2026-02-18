import { useState } from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface NewsletterFormProps {
  variant?: "inline" | "card";
}

export function NewsletterForm({ variant = "inline" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Ju lutem shkruani një email të vlefshëm.");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSubscribed(true);
    setEmail("");
    toast.success("U abonuat me sukses! Do të merrni lajmet më të reja.");
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-2 text-live">
        <CheckCircle className="h-5 w-5" />
        <span className="text-sm font-medium">Faleminderit! Jeni abonuar me sukses.</span>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Abonohuni në Newsletter</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Merrni lajmet më të reja direkt në email-in tuaj. Abonimi është falas.
        </p>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="email"
            placeholder="Email-i juaj"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10"
            disabled={isLoading}
          />
          <Button type="submit" className="w-full" size="sm" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Duke u abonuar...
              </>
            ) : (
              "Abonohu Tani"
            )}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        type="email"
        placeholder="Email-i juaj"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-9"
        disabled={isLoading}
      />
      <Button type="submit" className="w-full" size="sm" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Duke u abonuar...
          </>
        ) : (
          "Abonohu"
        )}
      </Button>
    </form>
  );
}
