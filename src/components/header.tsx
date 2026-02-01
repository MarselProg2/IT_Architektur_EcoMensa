"use client";

import { useAuth } from "@/components/auth-provider";
import { Leaf, Ticket } from "lucide-react"; // <--- Ticket Icon importieren
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CartSheet } from "./student/cart-sheet";
import { Button } from "./ui/button"; // <--- Button importieren

export function Header() {
  const { user, profile } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Linker Bereich: Logo & Navigation */}
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg italic">
              EcoMensa
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Reserve
            </Link>
            {/* Show Admin/Kitchen links only if authorized */}
            {profile?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === "/admin" ? "text-foreground" : "text-foreground/60"
                )}
              >
                Admin
              </Link>
            )}
            {profile?.role === 'KITCHEN' && (
              <Link
                href="/kitchen"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === "/kitchen"
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                Kitchen
              </Link>
            )}
            {/* Admin should also see Kitchen? Maybe not strict requirement but useful */}
            {profile?.role === 'ADMIN' && (
              <Link
                href="/kitchen"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === "/kitchen"
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                Kitchen
              </Link>
            )}
          </nav>
        </div>

        {/* Rechter Bereich: Icons & Profil */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* NEU: Button zu den Bestellungen */}
          <Link href="/orders">
            <Button variant="ghost" size="icon" title="Meine Bestellungen">
              <Ticket className="h-5 w-5 text-muted-foreground" />
            </Button>
          </Link>

          {/* Warenkorb */}
          <CartSheet />

          {/* Profil Anzeige (kein Switcher mehr) */}
          {user ? (
            <div className="flex items-center space-x-2 border-l pl-4 ml-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  {profile?.name?.charAt(0) || user.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left">
                <span className="font-semibold text-xs truncate w-full max-w-[120px]">
                  {profile?.name || user.email}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {profile?.role || "LOADING..."}
                </span>
              </div>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
