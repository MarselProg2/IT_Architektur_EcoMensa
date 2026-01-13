"use client";

import { useRole } from "@/context/role-context";
import { ROLES } from "@/lib/constants";
import { AccessDenied } from "@/components/admin/access-denied";
import { AdminDashboardWithSuspense } from "@/components/admin/admin-dashboard-loader";

export default function AdminPage() {
  const { currentUser } = useRole();

  if (currentUser.role !== ROLES.ADMIN) {
    return (
        <div className="container py-8 h-[calc(100vh-4rem)]">
            <AccessDenied />
        </div>
    )
  }

  // We are returning null, because the actual dashboard is now
  // rendered via the layout. This component only handles the access check.
  return null;
}
