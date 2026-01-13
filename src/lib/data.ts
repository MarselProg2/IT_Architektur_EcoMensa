// In-memory data store for demonstration purposes
import type { Meal, Order, OrderStatus } from './types';

let meals: Meal[] = [
  {
    id: 'meal-1',
    name: 'Vegetarian Surprise Box',
    description: 'A delightful mix of our vegetarian dishes of the day. Healthy, surprising, and delicious!',
    price: 5.99,
    initialStock: 20,
    currentStock: 12,
    pickupTimeStart: '14:00',
    pickupTimeEnd: '15:00',
    imageId: 'meal-1',
  },
  {
    id: 'meal-2',
    name: "Hearty Meat Lover's Meal",
    description: "Today's meat special with potatoes and a side of greens. A full, satisfying meal.",
    price: 7.50,
    initialStock: 15,
    currentStock: 5,
    pickupTimeStart: '14:00',
    pickupTimeEnd: '15:00',
    imageId: 'meal-2',
  },
  {
    id: 'meal-3',
    name: "Chef's Special Pasta",
    description: "A creamy and savory pasta dish, crafted from ingredients that need a home. Changes daily!",
    price: 6.50,
    initialStock: 25,
    currentStock: 0,
    pickupTimeStart: '14:00',
    pickupTimeEnd: '15:00',
    imageId: 'meal-3',
  },
    {
    id: 'meal-4',
    name: 'Fresh Salad Combo',
    description: 'A large, fresh salad with a variety of toppings and a bread roll.',
    price: 4.99,
    initialStock: 10,
    currentStock: 8,
    pickupTimeStart: '13:30',
    pickupTimeEnd: '14:30',
    imageId: 'meal-4',
  },
];

let orders: Order[] = [];

// Simulate latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- MEAL FUNCTIONS ---

export async function getMeals(): Promise<Meal[]> {
  await delay(100);
  return JSON.parse(JSON.stringify(meals));
}

export async function getMealById(id: string): Promise<Meal | undefined> {
  await delay(50);
  return meals.find(meal => meal.id === id);
}

export async function addMeal(mealData: Omit<Meal, 'id'>): Promise<Meal> {
  await delay(100);
  const newMeal: Meal = {
    ...mealData,
    id: `meal-${Date.now()}`,
  };
  meals.push(newMeal);
  return newMeal;
}

export async function updateMeal(id: string, updates: Partial<Meal>): Promise<Meal | null> {
    await delay(100);
    const mealIndex = meals.findIndex(m => m.id === id);
    if (mealIndex === -1) return null;

    const updatedMeal = { ...meals[mealIndex], ...updates };
    meals[mealIndex] = updatedMeal;
    return updatedMeal;
}


export async function deleteMeal(id: string): Promise<boolean> {
  await delay(100);
  const initialLength = meals.length;
  meals = meals.filter(meal => meal.id !== id);
  return meals.length < initialLength;
}

// --- ORDER FUNCTIONS ---

export async function createOrder(userId: string, mealId: string): Promise<Order | { error: string }> {
  await delay(200);
  const mealIndex = meals.findIndex(m => m.id === mealId);
  if (mealIndex === -1) {
    return { error: 'Meal not found.' };
  }
  if (meals[mealIndex].currentStock <= 0) {
    return { error: 'Meal is out of stock.' };
  }

  // "Transaction"
  meals[mealIndex].currentStock -= 1;

  const newOrder: Order = {
    id: `order-${Date.now()}`,
    userId,
    mealId,
    status: 'RESERVED',
    qrCodeData: `ECO${Date.now()}`,
    timestamp: new Date(),
  };
  orders.push(newOrder);
  return newOrder;
}

export async function getOrders(): Promise<Order[]> {
    await delay(100);
    return JSON.parse(JSON.stringify(orders));
}


export async function getOrderByQrCode(qrCodeData: string): Promise<Order | undefined> {
    await delay(50);
    return orders.find(order => order.qrCodeData === qrCodeData);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    await delay(100);
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return null;

    orders[orderIndex].status = status;
    return orders[orderIndex];
}

// --- STATS FUNCTIONS ---
export async function getDashboardStats() {
    await delay(150);
    const totalPackages = meals.reduce((sum, meal) => sum + meal.initialStock, 0);
    const remainingPackages = meals.reduce((sum, meal) => sum + meal.currentStock, 0);
    const packagesSold = totalPackages - remainingPackages;
    const revenue = orders
        .filter(o => o.status === 'PAID' || o.status === 'PICKED_UP')
        .reduce((sum, order) => {
            const meal = meals.find(m => m.id === order.mealId);
            return sum + (meal?.price || 0);
        }, 0);

    return { totalPackages, remainingPackages, packagesSold, revenue };
}

export async function getKitchenStats() {
    await delay(100);
    const pickupCount = orders.filter(o => o.status === 'RESERVED' || o.status === 'PAID').length;
    return { pickupCount };
}

// Initialize some orders for demo
if (orders.length === 0) {
    createOrder('user-1', 'meal-1');
}
