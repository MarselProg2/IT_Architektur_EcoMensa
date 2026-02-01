"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { useOrders } from "@/context/order-context";
import { useAuth } from "@/components/auth-provider";
import { reserveMealAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Trash2,
  CreditCard,
  Wallet,
  ArrowLeft,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { cn } from "@/lib/utils";

type CartView = "cart" | "checkout" | "success";
type PaymentMethod = "paypal" | "card" | null;

export function CartSheet() {
  const { items, removeFromCart, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();

  const [view, setView] = useState<CartView>("cart");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /* New logic for checkout */
  const { user } = useAuth();
  const { toast } = useToast();

  const handleCheckout = async () => {
    if (!paymentMethod || !user) {
      if (!user) toast({ title: "Login required", variant: "destructive" });
      return;
    }
    setIsProcessing(true);

    // Process items sequentially (Last-Mover: Reliability first)
    for (const item of items) {
      const result = await reserveMealAction(item.id, user.id);
      if (!result.success) {
        toast({ title: `Failed to reserve ${item.name}`, description: result.message, variant: "destructive" });
        // Continue or abort? Abort for now to avoid partial state confusion
        // But cart stays populated with remaining?
      }
    }

    clearCart();
    setIsProcessing(false);
    setView("success");
  };

  const resetCart = () => {
    setView("cart");
    setPaymentMethod(null);
  };

  return (
    <Sheet onOpenChange={(open) => !open && resetCart()}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>

      {/* WICHTIG: h-full und flex-col sorgen für die richtige Aufteilung */}
      <SheetContent className="flex flex-col h-full w-full sm:max-w-md">
        {/* 1. KOPFZEILE (Fixiert oben) */}
        <SheetHeader className="shrink-0">
          <SheetTitle className="flex items-center gap-2 font-headline">
            {view === "cart" && (
              <>
                <ShoppingCart className="h-5 w-5" /> Dein Warenkorb
              </>
            )}
            {view === "checkout" && (
              <>
                <CreditCard className="h-5 w-5" /> Kasse
              </>
            )}
            {view === "success" && (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" /> Fertig!
              </>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* 2. MITTELTEIL (Scrollbar, nimmt restlichen Platz ein) */}
        <div className="flex-1 overflow-hidden my-4">
          {/* VIEW: WARENKORB */}
          {view === "cart" && (
            <ScrollArea className="h-full pr-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 opacity-20 mb-2" />
                  <p>Dein Warenkorb ist leer.</p>
                </div>
              ) : (
                <div className="space-y-4 pb-4">
                  {" "}
                  {/* Extra padding unten */}
                  {items.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex justify-between items-center bg-secondary/20 p-3 rounded-lg"
                    >
                      <div className="space-y-1">
                        <p className="font-medium leading-none text-sm">
                          {item.name}
                        </p>
                        <p className="text-xs text-primary font-bold">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          )}

          {/* VIEW: CHECKOUT */}
          {view === "checkout" && (
            <div className="flex flex-col h-full">
              <Button
                variant="ghost"
                className="self-start mb-4 px-0"
                onClick={() => setView("cart")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
              </Button>

              <div className="space-y-4">
                <p className="font-semibold text-sm text-muted-foreground uppercase">
                  Zahlungsmethode wählen
                </p>

                <button
                  onClick={() => setPaymentMethod("paypal")}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all",
                    paymentMethod === "paypal"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Wallet className="text-blue-600" />
                    <span className="font-medium">PayPal</span>
                  </div>
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2",
                      paymentMethod === "paypal"
                        ? "bg-primary border-primary"
                        : "border-gray-300"
                    )}
                  />
                </button>

                <button
                  onClick={() => setPaymentMethod("card")}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all",
                    paymentMethod === "card"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-gray-600" />
                    <span className="font-medium">Kreditkarte</span>
                  </div>
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2",
                      paymentMethod === "card"
                        ? "bg-primary border-primary"
                        : "border-gray-300"
                    )}
                  />
                </button>
              </div>
            </div>
          )}

          {/* VIEW: SUCCESS */}
          {view === "success" && (
            <div className="flex flex-col h-full items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Bezahlung erfolgreich!</h3>
                <p className="text-muted-foreground mt-2">
                  Vielen Dank für deine Rettungsaktion.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 3. FUSSZEILE (Fixiert unten) */}
        <div className="mt-auto shrink-0 pt-4 border-t">
          {view === "cart" && items.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Gesamt</span>
                <span className="text-primary">${totalPrice.toFixed(2)}</span>
              </div>
              <Button
                className="w-full h-12 text-lg font-semibold"
                onClick={() => setView("checkout")}
              >
                Zur Kasse gehen
              </Button>
            </div>
          )}

          {view === "checkout" && (
            <div className="space-y-4">
              <div className="flex justify-between font-bold">
                <span>Zu zahlen</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <Button
                className="w-full h-12 text-lg"
                disabled={!paymentMethod || isProcessing}
                onClick={handleCheckout}
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  "Jetzt bezahlen"
                )}
              </Button>
            </div>
          )}

          {view === "success" && (
            <div className="space-y-2">
              <Link href="/orders" passHref>
                <Button
                  className="w-full h-12"
                  onClick={() =>
                    document.getElementById("close-sheet")?.click()
                  }
                >
                  Zu meinen Tickets (QR)
                </Button>
              </Link>
              <Button variant="ghost" className="w-full" onClick={resetCart}>
                Weiter einkaufen
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
