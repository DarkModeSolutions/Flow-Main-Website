// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      phone?: string | null;
      isAdmin: boolean;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    isAdmin: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    isAdmin: boolean;
  }
}
