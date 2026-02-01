"use client";

import { useAuth } from "@/components/auth-provider";
import { AccessDenied } from "@/components/admin/access-denied";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>
  }

  if (profile?.role !== 'ADMIN') {
    return (
      <div className="container py-8 h-[calc(100vh-4rem)]">
        <AccessDenied />
      </div>
    )
  }

  // We are returning null, because the actual dashboard is rendered via the layout.
  // This component only handles the access check for the route segment.
  return null;
}
