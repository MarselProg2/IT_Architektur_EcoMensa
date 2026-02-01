"use client";

import { Meal } from "@/lib/types";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Tag, ShoppingBag } from "lucide-react";
import { placeholderImages, getMealImage } from "@/lib/placeholder-images";

export function MealList({ meals }: { meals: Meal[] }) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAdd = (meal: Meal) => {
    addToCart(meal);
    toast({
      title: "Hinzugefügt",
      description: `${meal.name} wurde in den Warenkorb gelegt.`,
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {meals.map((meal) => {
        const image = placeholderImages[meal.imageId];
        const isSoldOut = meal.currentStock <= 0;

        return (
          <Card
            key={meal.id}
            className="flex flex-col h-full hover:shadow-lg transition-shadow"
          >
            <CardHeader className="p-0 relative h-48">
              <Image
                src={getMealImage(meal)}
                alt={meal.name}
                fill
                className="object-cover"
              />
              {isSoldOut && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive">Sold Out</Badge>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-grow p-6">
              <CardTitle className="mb-2">{meal.name}</CardTitle>
              <div className="flex items-center text-primary font-bold mb-3">
                <Tag className="mr-1 h-4 w-4" /> ${meal.price.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {meal.description}
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-0 space-y-3 flex flex-col">
              <div className="flex items-center text-xs text-muted-foreground self-start">
                <Clock className="mr-1 h-3 w-3" /> {meal.pickupTimeStart} -{" "}
                {meal.pickupTimeEnd}
              </div>
              <Button
                className="w-full"
                disabled={isSoldOut}
                onClick={() => handleAdd(meal)}
              >
                <ShoppingBag className="mr-2 h-4 w-4" /> In den Warenkorb
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
