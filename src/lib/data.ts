import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
  runTransaction,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Meal, Order, OrderStatus } from './types';

// --- MEAL FUNCTIONS ---

export async function getMeals(): Promise<Meal[]> {
  const mealsCol = collection(db, 'meals');
  const mealSnapshot = await getDocs(mealsCol);
  return mealSnapshot.docs.map(
    (doc) => ({ ...doc.data(), id: doc.id } as Meal)
  );
}

export async function getMealById(id: string): Promise<Meal | undefined> {
  const mealRef = doc(db, 'meals', id);
  const mealSnap = await getDoc(mealRef);
  if (!mealSnap.exists()) {
    return undefined;
  }
  return { ...mealSnap.data(), id: mealSnap.id } as Meal;
}

export async function addMeal(mealData: Omit<Meal, 'id'>): Promise<Meal> {
  const docRef = await addDoc(collection(db, 'meals'), mealData);
  return { ...mealData, id: docRef.id };
}

export async function updateMeal(
  id: string,
  updates: Partial<Omit<Meal, 'id'>>
): Promise<Meal | null> {
  const mealRef = doc(db, 'meals', id);
  await updateDoc(mealRef, updates);
  const updatedDoc = await getDoc(mealRef);
  if (!updatedDoc.exists()) {
    return null;
  }
  return { ...updatedDoc.data(), id: updatedDoc.id } as Meal;
}

export async function deleteMeal(id: string): Promise<boolean> {
  await deleteDoc(doc(db, 'meals', id));
  return true;
}

// --- ORDER FUNCTIONS ---

export async function createOrder(
  userId: string,
  mealId: string
): Promise<Order | { error: string }> {
  const mealRef = doc(db, 'meals', mealId);

  try {
    const newOrderData = await runTransaction(db, async (transaction) => {
      const mealDoc = await transaction.get(mealRef);
      if (!mealDoc.exists()) {
        throw 'Meal not found.';
      }

      const mealData = mealDoc.data() as Meal;
      if (mealData.currentStock <= 0) {
        throw 'Meal is out of stock.';
      }

      // Decrement stock
      transaction.update(mealRef, { currentStock: mealData.currentStock - 1 });

      // Create new order
      const newOrderRef = doc(collection(db, 'orders'));
      const orderPayload = {
        userId,
        mealId,
        status: 'RESERVED' as OrderStatus,
        qrCodeData: `ECO${Date.now()}`,
        timestamp: new Date(),
      };
      transaction.set(newOrderRef, orderPayload);

      return { ...orderPayload, id: newOrderRef.id };
    });
    return newOrderData;
  } catch (e: any) {
    console.error('Transaction failed: ', e);
    const errorMessage = typeof e === 'string' ? e : 'An unexpected error occurred during reservation.';
    return { error: errorMessage };
  }
}

export async function getOrders(): Promise<Order[]> {
  const ordersCol = collection(db, 'orders');
  const orderSnapshot = await getDocs(ordersCol);
  return orderSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      timestamp: (data.timestamp as Timestamp).toDate(),
    } as Order;
  });
}

export async function getOrderByQrCode(
  qrCodeData: string
): Promise<Order | undefined> {
  const q = query(collection(db, 'orders'), where('qrCodeData', '==', qrCodeData));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return undefined;
  }
  const orderDoc = querySnapshot.docs[0];
  const data = orderDoc.data();
  return {
    ...data,
    id: orderDoc.id,
    timestamp: (data.timestamp as Timestamp).toDate(),
  } as Order;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<Order | null> {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, { status });

  const updatedDoc = await getDoc(orderRef);
  if (!updatedDoc.exists()) {
    return null;
  }
  const data = updatedDoc.data();
  return {
    ...data,
    id: updatedDoc.id,
    timestamp: (data.timestamp as Timestamp).toDate(),
  } as Order;
}

// --- STATS FUNCTIONS ---

export async function getDashboardStats() {
  const meals = await getMeals();
  const orders = await getOrders();

  const totalPackages = meals.reduce(
    (sum, meal) => sum + meal.initialStock,
    0
  );
  const remainingPackages = meals.reduce(
    (sum, meal) => sum + meal.currentStock,
    0
  );
  const packagesSold = totalPackages - remainingPackages;

  const revenue = orders
    .filter((o) => o.status === 'PICKED_UP') // Assuming payment happens on pickup
    .reduce((sum, order) => {
      const meal = meals.find((m) => m.id === order.mealId);
      return sum + (meal?.price || 0);
    }, 0);

  return { totalPackages, remainingPackages, packagesSold, revenue };
}

export async function getKitchenStats() {
  const q = query(
    collection(db, 'orders'),
    where('status', 'in', ['RESERVED', 'PAID'])
  );
  const querySnapshot = await getDocs(q);
  const pickupCount = querySnapshot.size;
  return { pickupCount };
}
