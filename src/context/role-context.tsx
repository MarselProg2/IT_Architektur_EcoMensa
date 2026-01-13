"use client";

import { USERS, ROLES } from "@/lib/constants";
import type { Role, User } from "@/lib/types";
import { createContext, useContext, useState, useMemo, ReactNode } from "react";

interface RoleContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  availableUsers: User[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(USERS[0]);

  const value = useMemo(() => ({
    currentUser,
    setCurrentUser,
    availableUsers: USERS,
  }), [currentUser]);

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
