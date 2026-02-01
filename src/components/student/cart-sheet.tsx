"use client";

import { useCart } from "@/context/cart-context";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, CreditCard } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function CartSheet() {
  const { items, removeFromCart, totalPrice, clearCart } = useCart();

  return (
    <Sheet>
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
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-headline">
            <ShoppingCart className="h-5 w-5" /> Dein Warenkorb
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-grow my-4 pr-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 opacity-20 mb-2" />
              <p>Dein Warenkorb ist leer.</p>
            </div>
          ) : (
            <div className="space-y-4">
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
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {items.length > 0 && (
          <div className="space-y-4 border-t pt-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-lg font-bold">
                <span>Gesamt</span>
                <span className="text-primary">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <SheetFooter className="flex flex-col gap-2">
              <Button className="w-full h-12 text-lg font-semibold">
                <CreditCard className="mr-2 h-5 w-5" /> Jetzt Bestellen
              </Button>
              <Button
                variant="ghost"
                onClick={clearCart}
                className="text-muted-foreground text-xs"
              >
                Warenkorb leeren
              </Button>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
