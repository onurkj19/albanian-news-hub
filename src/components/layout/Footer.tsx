import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/common/NewsletterForm";
import { SITE_NAME, SITE_DESCRIPTION, SITE_EMAIL, SITE_PHONE, SITE_ADDRESS } from "@/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="bg-primary text-primary-foreground px-2.5 py-1 rounded-md font-black text-lg">
                {SITE_NAME}
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">{SITE_DESCRIPTION}</p>
            <div className="flex gap-2">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "YouTube" },
              ].map(({ icon: Icon, label }) => (
                <Button key={label} variant="ghost" size="icon" className="h-8 w-8" aria-label={label}>
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Navigimi</h3>
            <div className="space-y-2">
              {[
                { to: "/politike", label: "Politikë" },
                { to: "/ekonomi", label: "Ekonomi" },
                { to: "/sport", label: "Sport" },
                { to: "/teknologji", label: "Teknologji" },
                { to: "/bote", label: "Botë" },
                { to: "/kulture", label: "Kulturë" },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Kompania</h3>
            <div className="space-y-2">
              {[
                { to: "/rreth-nesh", label: "Rreth Nesh" },
                { to: "/kontakt", label: "Kontakt" },
                { to: "/reklamo", label: "Reklamo" },
                { to: "/privacy", label: "Politika e Privatësisë" },
                { to: "/terms", label: "Kushtet e Shërbimit" },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Newsletter</h3>
            <p className="text-sm text-muted-foreground">
              Merrni lajmet më të reja direkt në email-in tuaj.
            </p>
            <NewsletterForm variant="inline" />
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span>{SITE_EMAIL}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{SITE_PHONE}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>{SITE_ADDRESS}</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground">
          <p>&copy; {currentYear} Albanian News Network. Të gjitha të drejtat të rezervuara.</p>
        </div>
      </div>
    </footer>
  );
}
