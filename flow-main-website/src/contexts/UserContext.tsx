"use client";

import { SessionUser, UserContextType } from "@/types/types";
import { getSessionUserClient } from "@/utils/getUserDetailsClient";
import React, { createContext, useEffect, useState } from "react";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | unknown | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      console.log("Inside User context provider");
      setLoading(true);
      setError(null);
      try {
        const userData = await getSessionUserClient();
        setUser(userData);
        console.log("User data from context: ", userData);
      } catch (error) {
        setError(error);
        setUser(null);
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
