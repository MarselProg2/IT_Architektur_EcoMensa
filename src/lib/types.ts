import { ROLES } from './constants';

export type Role = typeof ROLES[keyof typeof ROLES];

export interface User {
  uid: string;
  name: string;
  email: string;
  role: Role;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  initialStock: number;
  currentStock: number;
  pickupTimeStart: string;
  pickupTimeEnd: string;
  imageId: string;
}

export type OrderStatus = 'RESERVED' | 'PAID' | 'PICKED_UP';

export interface Order {
  id: string;
  userId: string;
  mealId: string;
  status: OrderStatus;
  qrCodeData: string;
  timestamp: Date;
}
