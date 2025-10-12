import { Prisma, Products } from "@prisma/client";

// Get Payloads from DB
// export type ProductRequestWithIncludes = Prisma.ProductsGetPayload<{
//   select: {
//     description: true;
//   };
// }>;

export type UserDetailsWithIncludes = Prisma.UserGetPayload<{
  omit: {
    createdAt: true;
    updatedAt: true;
    password: true;
  };
}>;

export type ProductDetailsWithIncludes = Products;

// Custom Types

export interface RequestType {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
}

export type RegisterUserResponse = {
  message: string;
  user?: UserDetailsWithIncludes | null;
  tag?: string;
};

export type RegisterResult =
  | { success: true; user: UserDetailsWithIncludes }
  | { success: "tagged"; tag: "set-password" }
  | { success: false; error: string }
  | null;

export type Cart = {
  productId: string;
  quantity: number;
};

// Custom Context Types

export type ProductContextType = {
  products: ProductDetailsWithIncludes[] | null;
  error: unknown;
  loading: boolean;
  addToCart: ({ productId, quantity }: Cart) => number;
  removeFromCart: (productId: string) => void;
  cart: Cart[] | [];
  getCartItemQuantity: (productId: string) => number;
  incrementCartItem: (productId: string) => number;
  decrementCartItem: (productId: string) => number;
  clearCart: () => void;
};

export type SessionUser = {
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
