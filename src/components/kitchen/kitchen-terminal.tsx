"use client";

import { QrScanner } from "./qr-scanner";
import { Package, Utensils, ListIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MealManager } from "@/components/admin/meal-manager";
import type { Meal } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface KitchenTerminalProps {
  meals: Meal[];
  orders: any[]; // Using any for orders temporarily, should type it
}

export function KitchenTerminal({ meals, orders }: KitchenTerminalProps) {
  const activeCount = orders.length;

  return (
    <div className="h-full">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-headline uppercase tracking-widest text-muted-foreground">Kitchen Terminal</h1>
      </div>

      <Tabs defaultValue="terminal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="terminal">
            <Package className="mr-2 h-4 w-4" />
            Ausgabe & Scan
          </TabsTrigger>
          <TabsTrigger value="meals">
            <Utensils className="mr-2 h-4 w-4" />
            Mahlzeiten
          </TabsTrigger>
        </TabsList>

        <TabsContent value="terminal" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col items-center justify-center text-center gap-8">
            <div className="flex items-center justify-center gap-8">
              <Package className="h-24 w-24 text-primary animate-pulse" />
              <div className="text-left">
                <p className="text-sm uppercase tracking-widest text-muted-foreground">Offene Abholungen</p>
                <p className="text-8xl font-bold font-mono text-foreground">{activeCount}</p>
              </div>
            </div>

            <div className="w-full max-w-lg bg-card p-8 rounded-2xl shadow-xl border border-border/50">
              <h2 className="text-xl font-bold uppercase tracking-widest text-muted-foreground mb-6">
                Scan QR Code
              </h2>
              <QrScanner />
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ListIcon className="h-5 w-5" /> Validierungs-Liste ({activeCount})
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {orders.map(order => (
                <Card key={order.id} className="bg-muted/50 border-muted">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base font-mono">{order.qr_code_data}</CardTitle>
                      <Badge variant="outline">{order.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Meal ID: {order.meal_id}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ordered: {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
              {orders.length === 0 && (
                <p className="text-center text-muted-foreground col-span-full py-8">Keine offenen Bestellungen.</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="meals">
          <div className="bg-card p-6 rounded-lg border">
            <MealManager meals={meals} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
