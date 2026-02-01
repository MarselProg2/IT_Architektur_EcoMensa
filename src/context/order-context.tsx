"use client";

import React, { createContext, useContext, useState } from "react";
import { Meal } from "@/lib/types";

export interface OrderItem {
  id: string;
  date: string;
  items: Meal[];
  total: number;
  paymentMethod: "paypal" | "card";
  status: "active" | "completed" | "cancelled"; // Status-Definition
}

interface OrderContextType {
  orders: OrderItem[];
  addOrder: (
    items: Meal[],
    total: number,
    paymentMethod: "paypal" | "card"
  ) => void;
  markAsCompleted: (id: string) => boolean; // Neue Funktion
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<OrderItem[]>([]);

  const addOrder = (
    items: Meal[],
    total: number,
    paymentMethod: "paypal" | "card"
  ) => {
    const newOrder: OrderItem = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      items: items,
      total: total,
      paymentMethod: paymentMethod,
      status: "active",
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  // Diese Funktion sucht die Bestellung und setzt sie auf "completed"
  const markAsCompleted = (id: string): boolean => {
    let found = false;
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === id && order.status === "active") {
          found = true;
          return { ...order, status: "completed" };
        }
        return order;
      })
    );
    return found;
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, markAsCompleted }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context)
    throw new Error("useOrders must be used within an OrderProvider");
  return context;
};
