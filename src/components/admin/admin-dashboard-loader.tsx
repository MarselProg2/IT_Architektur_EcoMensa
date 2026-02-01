import AdminDashboard from "@/components/admin/admin-dashboard";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/server";
import { Meal } from "@/lib/types";

async function AdminDashboardLoader() {
  const supabase = await createClient();

  // Fetch Meals
  const { data: mealsData } = await supabase
    .from('meals')
    .select('*')
    .order('created_at', { ascending: false });

  // Fetch Orders for stats
  const { data: ordersData } = await supabase
    .from('orders')
    .select('*');

  // Map DB to Domain Model
  const meals: Meal[] = (mealsData || []).map(m => ({
    id: m.id,
    name: m.title, // Map title -> name
    description: m.description || '',
    price: Number(m.price),
    initialStock: m.initial_stock || 0,
    currentStock: m.current_stock,
    pickupTimeStart: m.pickup_time_start || '12:00',
    pickupTimeEnd: m.pickup_time_end || '14:00',
    imageId: m.image_id || 'meal-1'
  }));

  // Calculate Stats
  const totalPackages = meals.reduce((sum, meal) => sum + meal.initialStock, 0);
  const remainingPackages = meals.reduce((sum, meal) => sum + meal.currentStock, 0);
  const packagesSold = totalPackages - remainingPackages;

  const revenue = (ordersData || [])
    .filter(o => o.status === 'PAID' || o.status === 'PICKED_UP')
    .reduce((sum, order) => {
      const meal = meals.find(m => m.id === order.meal_id);
      return sum + (meal?.price || 0);
    }, 0);

  // Fetch Profiles for User Management
  const { data: profilesData } = await supabase
    .from('profiles')
    .select('*')
    .order('name', { ascending: true });


  const stats = {
    revenue,
    packagesSold,
    remainingPackages
  };

  return <AdminDashboard meals={meals} stats={stats} users={profilesData || []} />;
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
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboardLoader />
    </Suspense>
  );
}
