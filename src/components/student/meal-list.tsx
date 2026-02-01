"use client";

import { useState } from "react";
import type { Meal, Order } from "@/lib/types";
import { useRole } from "@/context/role-context";
import { reserveMealAction } from "@/lib/actions";
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
import {
  Clock,
  Loader2,
  PackageCheck,
  PackageX,
  Tag,
  ArrowLeft,
  CreditCard,
  Wallet,
  CheckCircle,
  ShoppingBag,
} from "lucide-react";
import { placeholderImages } from "@/lib/placeholder-images";

// Definiert die verschiedenen Ansichten (Views)
type ViewState = "list" | "payment" | "success";

interface MealListProps {
  meals: Meal[];
}

export function MealList({ meals }: MealListProps) {
  const { currentUser } = useRole();
  const { toast } = useToast();

  // States für den Workflow
  const [view, setView] = useState<ViewState>("list");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card" | null>(
    null
  );

  // 1. Schritt: Auswahl des Gerichts (Initialisiert Checkout)
  const handleInitiateCheckout = (meal: Meal) => {
    setSelectedMeal(meal);
    setView("payment");
  };

  // 2. Schritt: Bezahlung und Reservierung ausführen
  const handleConfirmPayment = async () => {
    if (!selectedMeal || !paymentMethod) return;

    setIsProcessing(true);

    // Simulation einer kurzen Verzögerung für das "Feeling" der Zahlung
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result = await reserveMealAction(selectedMeal.id, currentUser.uid);

    if (result.success && result.order) {
      setConfirmedOrder(result.order);
      setView("success");
      toast({ title: "Bezahlung erfolgreich!", description: result.message });
    } else {
      toast({
        title: "Fehler",
        description: result.message,
        variant: "destructive",
      });
      setView("list");
    }
    setIsProcessing(false);
  };

  // --- ANSICHT: ERFOLGREICHE RESERVIERUNG ---
  if (view === "success" && confirmedOrder) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Guten Appetit!</h2>
        <p className="text-muted-foreground mb-8">
          Deine Reservierung ist abgeschlossen.
        </p>

        <Card className="w-full max-w-sm p-6 border-2 border-dashed mb-8">
          <div className="bg-slate-900 text-white p-8 rounded-lg mb-4 flex flex-col items-center justify-center">
            <div className="text-[10px] opacity-50 mb-2 font-mono">
              DIGITAL TICKET
            </div>
            <div className="text-xl font-mono tracking-widest">
              {confirmedOrder.id}
            </div>
          </div>
          <div className="text-left space-y-2">
            <p className="text-sm font-bold">{selectedMeal?.name}</p>
            <p className="text-xs text-muted-foreground">
              Abholung: {selectedMeal?.pickupTimeStart} -{" "}
              {selectedMeal?.pickupTimeEnd} Uhr
            </p>
          </div>
        </Card>

        <Button onClick={() => setView("list")} variant="outline">
          Zurück zur Übersicht
        </Button>
      </div>
    );
  }

  // --- ANSICHT: CHECKOUT / ZAHLUNG ---
  if (view === "payment" && selectedMeal) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-300">
        <Button
          variant="ghost"
          onClick={() => setView("list")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
        </Button>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Zusammenfassung */}
          <Card>
            <CardHeader>
              <CardTitle>Zusammenfassung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>{selectedMeal.name}</span>
                <span className="font-bold">
                  ${selectedMeal.price.toFixed(2)}
                </span>
              </div>
              <div className="border-t pt-4 flex justify-between items-center text-lg font-bold">
                <span>Gesamt</span>
                <span className="text-primary">
                  ${selectedMeal.price.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Zahlungsmethoden */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
              Zahlungsmethode
            </h3>

            <button
              onClick={() => setPaymentMethod("paypal")}
              className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                paymentMethod === "paypal"
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <Wallet className="text-blue-600" />
                <span className="font-medium">PayPal</span>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  paymentMethod === "paypal"
                    ? "bg-primary border-primary"
                    : "border-gray-300"
                }`}
              />
            </button>

            <button
              onClick={() => setPaymentMethod("card")}
              className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                paymentMethod === "card"
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="text-gray-600" />
                <span className="font-medium">Kreditkarte</span>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  paymentMethod === "card"
                    ? "bg-primary border-primary"
                    : "border-gray-300"
                }`}
              />
            </button>

            <Button
              className="w-full h-12 text-lg mt-4"
              disabled={!paymentMethod || isProcessing}
              onClick={handleConfirmPayment}
            >
              {isProcessing ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                "Jetzt bezahlen"
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- ANSICHT: LISTE (DEIN ORIGINALER CODE) ---
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {meals.map((meal) => {
        const image = placeholderImages[meal.imageId];
        const isSoldOut = meal.currentStock <= 0;

        return (
          <Card
            key={meal.id}
            className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <CardHeader className="p-0">
              <div className="relative h-48 w-full">
                <Image
                  src={
                    image?.imageUrl ||
                    `https://picsum.photos/seed/${meal.id}/600/400`
                  }
                  alt={meal.name}
                  fill
                  className="object-cover"
                />
                {isSoldOut && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Badge variant="destructive" className="text-lg px-4 py-2">
                      AUSVERKAUFT
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-6 pb-2">
                <CardTitle className="font-headline text-xl mb-2">
                  {meal.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {meal.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-3 px-6">
              <div className="flex items-center text-sm">
                <Tag className="mr-2 h-4 w-4 text-primary" />
                <span className="font-bold text-lg">
                  ${meal.price.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                Abholung: {meal.pickupTimeStart} - {meal.pickupTimeEnd}
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button
                className="w-full"
                onClick={() => handleInitiateCheckout(meal)}
                disabled={isSoldOut}
              >
                {isSoldOut ? "Ausverkauft" : "In den Warenkorb"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
