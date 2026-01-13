"use server";

import { revalidatePath } from 'next/cache';
import { addMeal, createOrder, deleteMeal, getOrderByQrCode, updateMeal, updateOrderStatus } from './data';
import type { Meal } from './types';

export async function reserveMealAction(mealId: string, userId: string) {
  try {
    const result = await createOrder(userId, mealId);
    if ('error' in result) {
      return { success: false, message: result.error, order: null };
    }
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/kitchen');
    return { success: true, message: 'Reservation successful!', order: result };
  } catch (error) {
    return { success: false, message: 'An unexpected error occurred.', order: null };
  }
}

export async function confirmPickupAction(qrCodeData: string) {
    try {
        const order = await getOrderByQrCode(qrCodeData);
        if (!order) {
            return { success: false, message: "Invalid QR Code. Order not found." };
        }
        if (order.status === 'PICKED_UP') {
            return { success: false, message: "This order has already been picked up." };
        }
        
        await updateOrderStatus(order.id, 'PICKED_UP');
        revalidatePath('/kitchen');
        revalidatePath('/admin');
        return { success: true, message: `Order ${order.id.slice(-6)} confirmed! Meal: ${order.mealId}` };
    } catch (error) {
        return { success: false, message: "An unexpected error occurred during pickup." };
    }
}

export async function addMealAction(data: Omit<Meal, 'id'>) {
    try {
        await addMeal(data);
        revalidatePath('/admin');
        return { success: true, message: 'Meal added successfully.' };
    } catch (error) {
        return { success: false, message: 'Failed to add meal.' };
    }
}

export async function updateMealAction(id: string, data: Partial<Meal>) {
    try {
        await updateMeal(id, data);
        revalidatePath('/admin');
        return { success: true, message: 'Meal updated successfully.' };
    } catch (error) {
        return { success: false, message: 'Failed to update meal.' };
    }
}

export async function deleteMealAction(id: string) {
    try {
        await deleteMeal(id);
        revalidatePath('/admin');
        return { success: true, message: 'Meal deleted successfully.' };
    } catch (error) {
        return { success: false, message: 'Failed to delete meal.' };
    }
}
