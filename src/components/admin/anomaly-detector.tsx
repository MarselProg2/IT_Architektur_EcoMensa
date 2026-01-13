"use client";

import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { detectMealPackageAnomalies, DetectMealPackageAnomaliesOutput } from "@/ai/flows/detect-meal-package-anomalies";
import type { Meal } from "@/lib/types";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Lightbulb, AlertTriangle } from "lucide-react";

const formSchema = z.object({
  mealPackageName: z.string().min(1, "Please select a meal."),
  currentStock: z.coerce.number().int().min(0, "Current stock must be a non-negative integer."),
  expectedStock: z.coerce.number().int().min(0, "Expected stock must be a non-negative integer."),
});

interface AnomalyDetectorProps {
  meals: Meal[];
}

export function AnomalyDetector({ meals }: AnomalyDetectorProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectMealPackageAnomaliesOutput | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mealPackageName: "",
      currentStock: 0,
      expectedStock: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setResult(null);

    // Mock historical data as we don't have a real database
    const historicalData = JSON.stringify([
      { date: "yesterday", sold: (meals.find(m => m.id === values.mealPackageName)?.initialStock || 20) - values.expectedStock },
      { date: "day before", sold: (meals.find(m => m.id === values.mealPackageName)?.initialStock || 20) - values.expectedStock + 2 },
    ]);
    
    const meal = meals.find(m => m.id === values.mealPackageName);

    try {
      const response = await detectMealPackageAnomalies({
        mealPackageName: meal?.name || 'Unknown Meal',
        currentStock: values.currentStock,
        expectedStock: values.expectedStock,
        historicalData,
      });
      setResult(response);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Anomaly detection failed:", error);
      // Here you would use a toast to show an error
    } finally {
      setLoading(false);
    }
  };
  
  const selectedMealId = form.watch("mealPackageName");
  const selectedMeal = meals.find(m => m.id === selectedMealId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">AI Anomaly Detection</CardTitle>
        <CardDescription>
          Find deviations between actual and expected leftover meals to optimize stock.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="mealPackageName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meal Package</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a meal to analyze" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {meals.map((meal) => (
                        <SelectItem key={meal.id} value={meal.id}>
                          {meal.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectedMeal && (
                 <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="currentStock"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Current Stock (Actual)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="expectedStock"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Expected Stock</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                             <FormMessage />
                            </FormItem>
                        )}
                        />
                 </div>
            )}
            <Button type="submit" disabled={loading || !selectedMealId}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analyze Consumption
            </Button>
          </form>
        </Form>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
            {result && (
                <>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-headline">
                        {result.isAnomaly ? <AlertTriangle className="h-6 w-6 text-destructive" /> : <Lightbulb className="h-6 w-6 text-green-500" />}
                        Analysis Complete: {result.isAnomaly ? "Anomaly Detected" : "No Anomaly"}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <h3 className="font-semibold">Explanation</h3>
                        <p className="text-sm text-muted-foreground">{result.anomalyExplanation}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold">Suggested Actions</h3>
                        <p className="text-sm text-muted-foreground">{result.suggestedActions}</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                </DialogFooter>
                </>
            )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
