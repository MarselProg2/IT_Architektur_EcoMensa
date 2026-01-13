"use client";

import { useState } from "react";
import type { Meal, Order } from "@/lib/types";
import { useRole } from "@/context/role-context";
import { reserveMealAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Loader2, Package, PackageCheck, PackageX, Tag } from "lucide-react";
import { placeholderImages } from "@/lib/placeholder-images";
import { ReservationDialog } from "./reservation-dialog";

interface MealListProps {
  meals: Meal[];
}

export function MealList({ meals }: MealListProps) {
  const { currentUser } = useRole();
  const { toast } = useToast();
  const [loadingMealId, setLoadingMealId] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const handleReserve = async (mealId: string) => {
    setLoadingMealId(mealId);
    const result = await reserveMealAction(mealId, currentUser.uid);
    if (result.success && result.order) {
      toast({
        title: "Success!",
        description: result.message,
      });
      setConfirmedOrder(result.order);
      setShowDialog(true);
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
    setLoadingMealId(null);
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {meals.map((meal) => {
          const image = placeholderImages[meal.imageId];
          const isSoldOut = meal.currentStock <= 0;
          const isLoading = loadingMealId === meal.id;

          return (
            <Card key={meal.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={image?.imageUrl || `https://picsum.photos/seed/${meal.id}/600/400`}
                    alt={meal.name}
                    data-ai-hint={image?.imageHint}
                    fill
                    className="object-cover"
                  />
                  {isSoldOut && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge variant="destructive" className="text-lg px-4 py-2">SOLD OUT</Badge>
                    </div>
                  )}
                </div>
                <div className="p-6 pb-2">
                    <CardTitle className="font-headline text-xl mb-2">{meal.name}</CardTitle>
                    <CardDescription>{meal.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-3 px-6">
                <div className="flex items-center text-sm text-muted-foreground">
                    <Tag className="mr-2 h-4 w-4" />
                    <span className="font-bold text-lg text-primary">${meal.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    Pickup: {meal.pickupTimeStart} - {meal.pickupTimeEnd}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4 p-6 pt-0">
                <div className="flex items-center space-x-2">
                    {isSoldOut ? (
                        <PackageX className="h-5 w-5 text-destructive" />
                    ) : (
                        <PackageCheck className="h-5 w-5 text-green-600" />
                    )}
                    <span className={`text-sm font-medium ${isSoldOut ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {meal.currentStock} left
                    </span>
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleReserve(meal.id)}
                  disabled={isSoldOut || isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSoldOut ? "Sold Out" : "Reserve Now"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      <ReservationDialog open={showDialog} onOpenChange={setShowDialog} order={confirmedOrder} />
    </>
  );
}
