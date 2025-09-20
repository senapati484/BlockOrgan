"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Heart, Shield, Users, BarChart3 } from "lucide-react";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { useAuth } from "@/components/auth-provider";
import { getUserPublicRole } from "@/lib/db";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [role, setRole] = useState<"admin" | "donor" | "recipient" | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadRole() {
      if (!user) {
        if (!cancelled) setRole(null);
        return;
      }
      try {
        const r = await getUserPublicRole(user.uid);
        if (!cancelled) setRole(r);
      } catch {
        if (!cancelled) setRole(null);
      }
    }
    loadRole();
    return () => { cancelled = true };
  }, [user]);

  const navItems = [
    { href: "/how-it-works", label: "How It Works", icon: Shield },
    { href: "/about", label: "About", icon: Heart },
    { href: "/contact", label: "Contact", icon: Users },
    ...(user
      ? [{ href: "/dashboard", label: "Dashboard", icon: BarChart3 }]
      : []),
    ...(user && role === "admin"
      ? [{ href: "/admin", label: "Admin", icon: Users }]
      : []),
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              BlockOrgan
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            ) : (
              <ProfileDropdown />
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                <div className="pt-4 border-t">
                  <div className="flex flex-col space-y-2 cursor-pointer">
                    {!user ? (
                      <>
                        <Button
                          variant="ghost"
                          asChild
                          className="justify-start"
                        >
                          <Link href="/login" onClick={() => setIsOpen(false)}>
                            Sign In
                          </Link>
                        </Button>
                        <Button asChild className="justify-start">
                          <Link
                            href="/register"
                            onClick={() => setIsOpen(false)}
                          >
                            Get Started
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          asChild
                          className="justify-start"
                        >
                          <Link
                            href="/dashboard"
                            onClick={() => setIsOpen(false)}
                          >
                            Dashboard
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="justify-start bg-transparent"
                          onClick={async () => {
                            await signOut();
                            setIsOpen(false);
                          }}
                        >
                          Log out
                        </Button>
                        <ProfileDropdown />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
