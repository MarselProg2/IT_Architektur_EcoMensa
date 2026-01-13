import { getDashboardStats, getMeals } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MealManager } from "./meal-manager";
import { AnomalyDetector } from "./anomaly-detector";
import { StatsCards } from "./stats-cards";

// WICHTIG: 'async' hinzugefügt, da wir 'await' nutzen
export default async function AdminDashboard() {
  // Parallel fetching für bessere Performance (Promise.all)
  // Das verhindert den "Wasserfall-Effekt" beim Laden
  const [meals, stats] = await Promise.all([
    getMeals(),
    getDashboardStats()
  ]);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Steuerung der Mensa-Auslastung und KI-basierte Abfallanalyse.
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Übersicht (KPIs)</TabsTrigger>
          <TabsTrigger value="manage">Pakete verwalten</TabsTrigger>
          <TabsTrigger value="ai">Smart Insights (KI)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <StatsCards stats={stats} />
        </TabsContent>
        
        <TabsContent value="manage" className="space-y-4">
          <MealManager meals={meals} />
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-4">
          {/* Implementiert die "Smart Insights" Anforderung  */}
          <AnomalyDetector meals={meals} /> 
        </TabsContent>
      </Tabs>
    </div>
  );
}