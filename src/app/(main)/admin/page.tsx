"use client";

import { useRole } from "@/context/role-context";
import { ROLES } from "@/lib/constants";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AccessDenied } from "@/components/admin/access-denied";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function AdminDashboardSkeleton() {
    return (
        <div className="container py-8 space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-5 w-96" />
            </div>
            <Skeleton className="h-10 w-full" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
            </div>
        </div>
    )
}

function AdminDashboardLoader() {
    return (
      <Suspense fallback={<AdminDashboardSkeleton/>}>
        <AdminDashboard />
      </Suspense>
    );
}

export default function AdminPage() {
  const { currentUser } = useRole();

  if (currentUser.role !== ROLES.ADMIN) {
    return (
        <div className="container py-8 h-[calc(100vh-4rem)]">
            <AccessDenied />
        </div>
    )
  }

  return <AdminDashboardLoader />;
}
