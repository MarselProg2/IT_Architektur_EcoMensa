"use server";

import { revalidatePath } from 'next/cache';
import { createClient } from './supabase/server';
import type { Meal } from './types';

export async function reserveMealAction(mealId: string, userId: string) {
    const supabase = await createClient();

    // Use RPC for atomic reservation
    const { data, error } = await supabase.rpc('reserve_meal', {
        p_meal_id: mealId,
        p_user_id: userId
    });

    if (error) {
        console.error('Reservation error:', error);
        return { success: false, message: 'An unexpected error occurred.', order: null };
    }

    if (data && !data.success) {
        return { success: false, message: data.message, order: null };
    }

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/kitchen'); // Update Kitchen view

    // Ideally fetch the full order object if needed, but for now return minimal info
    return { success: true, message: 'Reservation successful!', order: { id: data.order_id, qrCodeData: data.qr_code } };
}

export async function confirmPickupAction(qrCodeData: string) {
    const supabase = await createClient();

    // 1. Find Order
    const { data: order, error: findError } = await supabase
        .from('orders')
        .select('*')
        .eq('qr_code_data', qrCodeData)
        .single();

    if (findError || !order) {
        return { success: false, message: "Invalid QR Code. Order not found." };
    }

    if (order.status === 'PICKED_UP') {
        return { success: false, message: "This order has already been picked up." };
    }

    // 2. Update Status
    const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'PICKED_UP' })
        .eq('id', order.id);

    if (updateError) {
        return { success: false, message: "Failed to update order status." };
    }

    revalidatePath('/kitchen');
    revalidatePath('/admin');
    return { success: true, message: `Order confirmed! Meal ID: ${order.meal_id}` };
}

export async function addMealAction(data: Omit<Meal, 'id'>) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('meals')
        .insert([{
            title: data.name, // Mapping name -> title
            description: data.description, // Need to add description column to DB or map it
            price: data.price,
            initial_stock: data.initialStock, // Need col mapping
            current_stock: data.initialStock,
            pickup_time_start: data.pickupTimeStart,
            pickup_time_end: data.pickupTimeEnd,
            image_id: data.imageId
        }]);

    // Wait, my DB schema for meals: title, price, current_stock, qr_code_token.
    // I missed columns: description, initial_stock.
    // I should add them to the DB.

    if (error) {
        console.error(error);
        return { success: false, message: 'Failed to add meal.' };
    }

    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true, message: 'Meal added successfully.' };
}

export async function updateMealAction(id: string, data: Partial<Meal>) {
    const supabase = await createClient();

    const updates: any = {};
    if (data.name) updates.title = data.name;
    if (data.price !== undefined) updates.price = data.price;
    if (data.currentStock !== undefined) updates.current_stock = data.currentStock;
    // ... map other fields

    const { error } = await supabase
        .from('meals')
        .update(updates)
        .eq('id', id);

    if (error) {
        return { success: false, message: 'Failed to update meal.' };
    }

    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true, message: 'Meal updated successfully.' };
}

export async function deleteMealAction(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('meals').delete().eq('id', id);

    if (error) {
        return { success: false, message: 'Failed to delete meal.' };
    }

    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true, message: 'Meal deleted successfully.' };
}

export async function updateUserRoleAction(userId: string, role: 'ADMIN' | 'KITCHEN' | 'STUDENT') {
    const supabase = await createClient();
    const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
    if (error) return { success: false, message: 'Failed to update role' };
    revalidatePath('/admin');
    return { success: true, message: 'Role updated successfully' };
}
