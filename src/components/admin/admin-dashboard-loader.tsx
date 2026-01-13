import AdminDashboard from "@/components/admin/admin-dashboard";
import { getDashboardStats, getMeals } from "@/lib/data";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function AdminDashboardLoader() {
  const [meals, stats] = await Promise.all([
    getMeals(),
    getDashboardStats()
  ]);

  return <AdminDashboard meals={meals} stats={stats} />;
}

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

export function AdminDashboardWithSuspense() {
    return (
      <Suspense fallback={<AdminDashboardSkeleton/>}>
        <AdminDashboardLoader />
      </Suspense>
    );
}
