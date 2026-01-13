import AdminDashboard from "@/components/admin/admin-dashboard";
import { getDashboardStats, getMeals } from "@/lib/data";

export async function AdminDashboardLoader() {
  const [meals, stats] = await Promise.all([
    getMeals(),
    getDashboardStats()
  ]);

  return <AdminDashboard meals={meals} stats={stats} />;
}
