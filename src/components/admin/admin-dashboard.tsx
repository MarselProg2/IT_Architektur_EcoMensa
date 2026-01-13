import { getDashboardStats, getMeals } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MealManager } from "./meal-manager";
import { AnomalyDetector } from "./anomaly-detector";
import { StatsCards } from "./stats-cards";

export async function AdminDashboard() {
  const meals = await getMeals();
  const stats = await getDashboardStats();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage meals, view stats, and run AI analysis.</p>
      </div>
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="manage">Manage Meals</TabsTrigger>
          <TabsTrigger value="ai">AI Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <StatsCards stats={stats} />
        </TabsContent>
        <TabsContent value="manage">
          <MealManager meals={meals} />
        </TabsContent>
        <TabsContent value="ai">
          <AnomalyDetector meals={meals} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
