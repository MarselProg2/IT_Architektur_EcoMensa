"use client";

import { useRole } from "@/context/role-context";
import { Leaf, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const { currentUser, setCurrentUser, availableUsers } = useRole();
  const pathname = usePathname();

  const handleRoleChange = (uid: string) => {
    const user = availableUsers.find((u) => u.uid === uid);
    if (user) {
      setCurrentUser(user);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">EcoMensa</span>
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
            <Link
              href="/admin"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/admin" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Admin
            </Link>
            <Link
              href="/kitchen"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/kitchen" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Kitchen
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                {currentUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Select value={currentUser.uid} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-[180px]">
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-sm">{currentUser.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">{currentUser.role}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map((user) => (
                  <SelectItem key={user.uid} value={user.uid}>
                    {user.name} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
}
