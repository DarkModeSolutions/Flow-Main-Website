import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      phone?: string | null;
      age: number | null;
      address:
        | {
            id: string;
            userId: string;
            addressLine1: string;
            addressLine2: string | null;
            pincode: string;
            city: string;
            state: string;
            country: string;
          }[]
        | null;
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
    address:
      | {
          id: string;
          userId: string;
          addressLine1: string;
          addressLine2: string | null;
          pincode: string;
          city: string;
          state: string;
          country: string;
        }[]
      | null;
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
    address:
      | {
          id: string;
          userId: string;
          addressLine1: string;
          addressLine2: string | null;
          pincode: string;
          city: string;
          state: string;
          country: string;
        }[]
      | null;
    isAdmin: boolean;
    buyingAsGuest: boolean;
    favourites: string[];
  }
}
