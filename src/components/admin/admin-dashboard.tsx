import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MealManager } from "./meal-manager";
import { StatsCards } from "./stats-cards";
import { UserManager } from "./user-manager";
import type { Meal } from "@/lib/types";

interface AdminDashboardProps {
  meals: Meal[];
  stats: {
    revenue: number;
    packagesSold: number;
    remainingPackages: number;
  };
  users: any[];
}

export default function AdminDashboard({ meals, stats, users }: AdminDashboardProps) {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Steuerung der Mensa-Auslastung.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Übersicht (KPIs)</TabsTrigger>
          <TabsTrigger value="manage">Pakete verwalten</TabsTrigger>
          <TabsTrigger value="users">Nutzer verwalten</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <StatsCards stats={stats} />
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <MealManager meals={meals} />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserManager users={users} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
