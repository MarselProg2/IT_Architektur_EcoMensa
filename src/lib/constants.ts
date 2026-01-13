import type { User } from './types';

export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
  KITCHEN: 'kitchen',
} as const;

export const USERS: User[] = [
  { uid: 'user-1', name: 'Alex Doe', email: 'alex@example.com', role: ROLES.STUDENT },
  { uid: 'user-2', name: 'Bernard Lane', email: 'bernard@example.com', role: ROLES.ADMIN },
  { uid: 'user-3', name: 'Casey Smith', email: 'casey@example.com', role: ROLES.KITCHEN },
];
