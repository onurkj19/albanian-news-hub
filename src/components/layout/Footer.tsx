import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded font-bold text-xl">
                ALNN
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Albanian News Network - Burimi juaj i besueshëm për lajmet më të reja nga Shqipëria dhe bota.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Navigimi</h3>
            <div className="space-y-2">
              <Link to="/politike" className="block text-sm text-muted-foreground hover:text-primary">
                Politikë
              </Link>
              <Link to="/ekonomi" className="block text-sm text-muted-foreground hover:text-primary">
                Ekonomi
              </Link>
              <Link to="/sport" className="block text-sm text-muted-foreground hover:text-primary">
                Sport
              </Link>
              <Link to="/showbiz" className="block text-sm text-muted-foreground hover:text-primary">
                Showbiz
              </Link>
              <Link to="/teknologji" className="block text-sm text-muted-foreground hover:text-primary">
                Teknologji
              </Link>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Kompania</h3>
            <div className="space-y-2">
              <Link to="/rreth-nesh" className="block text-sm text-muted-foreground hover:text-primary">
                Rreth Nesh
              </Link>
              <Link to="/kontakt" className="block text-sm text-muted-foreground hover:text-primary">
                Kontakt
              </Link>
              <Link to="/reklamo" className="block text-sm text-muted-foreground hover:text-primary">
                Reklamo
              </Link>
              <Link to="/privacy" className="block text-sm text-muted-foreground hover:text-primary">
                Politika e Privatësisë
              </Link>
              <Link to="/terms" className="block text-sm text-muted-foreground hover:text-primary">
                Kushtet e Shërbimit
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Newsletter</h3>
            <p className="text-sm text-muted-foreground">
              Merrni lajmet më të reja direkt në email-in tuaj.
            </p>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email-i juaj"
                className="h-9"
              />
              <Button className="w-full" size="sm">
                Abonohu
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>info@alnn.al</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>+355 4 123 4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Tiranë, Shqipëri</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Albanian News Network. Të gjitha të drejtat të rezervuara.</p>
        </div>
      </div>
    </footer>
  );
}