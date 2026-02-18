import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Shield } from "lucide-react";
import { toast } from "sonner";
import { SITE_NAME } from "@/constants";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Ju lutem plotësoni të gjitha fushat.");
      return;
    }

    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);

    if (success) {
      toast.success("Mirësevini! Jeni kyçur me sukses.");
      navigate(from, { replace: true });
    } else {
      toast.error("Email-i ose fjalëkalimi janë gabim.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="bg-primary text-primary-foreground px-2.5 py-1 rounded-md font-black text-lg">
              {SITE_NAME}
            </div>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl">Hyrja e Administratorit</CardTitle>
            <CardDescription>
              Kyçuni për të aksesuar panelin e administrimit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@alnn.al"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Fjalëkalimi</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Duke u kyçur...
                  </>
                ) : (
                  "Kyçu"
                )}
              </Button>
            </form>

          </CardContent>
        </Card>

        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            Kthehu në faqen kryesore
          </Link>
        </div>
      </div>
    </div>
  );
}
