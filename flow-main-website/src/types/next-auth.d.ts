// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      phone?: string | null;
      age: number | null;
      address: string | null;
      isAdmin: boolean;
      buyingAsGuest: boolean;
      favourites: string[];
    };
  }

  interface User {
    id: string;
    email?: string | null;
    name?: string | null;
    phone?: string | null;
    age: number | null;
    address: string | null;
    isAdmin: boolean;
    buyingAsGuest: boolean;
    favourites: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email?: string | null;
    name?: string | null;
    phone?: string | null;
    age: number | null;
    address: string | null;
    isAdmin: boolean;
    buyingAsGuest: boolean;
    favourites: string[];
  }
}
