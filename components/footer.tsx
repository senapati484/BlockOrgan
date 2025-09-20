import Link from "next/link";
import { Heart, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">BlockOrgan</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Transparent, secure organ donation matching powered by blockchain
              technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/how-it-works"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/about"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/faq"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                FAQ
              </Link>
            </div>
          </div>

          {/* For Users */}
          <div className="space-y-4">
            <h3 className="font-semibold">For Users</h3>
            <div className="space-y-2">
              <Link
                href="/donor/register"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Become a Donor
              </Link>
              <Link
                href="/recipient/register"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Register as Recipient
              </Link>
              <Link
                href="/dashboard"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@lifechain.org</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>1-800-LIFE-CHAIN</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 LifeChain. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
