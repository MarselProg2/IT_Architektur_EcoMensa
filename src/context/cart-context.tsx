"use client";

import React, { createContext, useContext, useState } from "react";
import { Meal } from "@/lib/types";

interface CartContextType {
  items: Meal[];
  addToCart: (meal: Meal) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Meal[]>([]);

  const addToCart = (meal: Meal) => {
    setItems((prev) => [...prev, meal]);
  };

  const removeFromCart = (id: string) => {
    // Entfernt nur das erste Vorkommen des Artikels (falls man zwei gleiche hat)
    setItems((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index > -1) {
        const newItems = [...prev];
        newItems.splice(index, 1);
        return newItems;
      }
      return prev;
    });
  };

  const clearCart = () => setItems([]);

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
