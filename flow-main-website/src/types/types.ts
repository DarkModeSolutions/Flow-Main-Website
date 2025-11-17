import { Address, Prisma, Products, User } from "@prisma/client";

// Get Payloads from DB
// export type ProductRequestWithIncludes = Prisma.ProductsGetPayload<{
//   select: {
//     description: true;
//   };
// }>;

export type UserAllDetails = User;

export type AllProductDetails = Products;

export type AddressAllDetails = Address;

export type UserDetailsWithIncludes = Prisma.UserGetPayload<{
  include: {
    address: true;
  };
  omit: {
    createdAt: true;
    updatedAt: true;
    password: true;
  };
}>;

export type OrderDetailsWiithIncludes = Prisma.OrdersGetPayload<{
  omit: {
    updatedAt: true;
    payment_link_id: true;
  };
  include: {
    orderItems: true;
    _count: true;
  };
}>;

// Custom Types

export type UserDetails = {
  user: UserAllDetails | null;
  address: AddressAllDetails[] | null;
};

export interface RequestType {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  additionalHeaders?: Record<string, string>;
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
  products: AllProductDetails[] | null;
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

export type UserContextType = {
  user: SessionUser | null;
  loading: boolean;
  error: string | unknown | null;
  setUser: React.Dispatch<React.SetStateAction<SessionUser | null>>;
};

// Session User Type

export type SessionUser = {
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

export type ShadowfaxOrderPayload = {
  order_type: "marketplace";
  order_details: {
    client_order_id: string;
    awb_number?: string;
    actual_weight?: number;
    volumetric_weight?: number;
    product_value: number;
    cod_amount: number;
    payment_mode: "Prepaid" | "COD";
    promised_delivery_date?: string;
    total_amount?: number;
    eway_bill?: string;
    gstin_number?: string;
    order_service?: "regular" | "express";
  };
  customer_details: {
    name: string;
    contact: string;
    alternate_contact?: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    pincode: number;
    latitude?: string;
    longitude?: string;
  };
  pickup_details: {
    name?: string;
    contact: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    pincode: number;
    latitude?: string;
    longitude?: string;
    unique_code?: string;
  };
  rts_details: {
    name: string;
    contact: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    pincode: number;
    email?: string;
    latitude?: string;
    longitude?: string;
    unique_code?: string;
  };
  product_details: {
    sku_id?: string;
    sku_name: string;
    hsn_code?: string;
    invoice_no?: string;
    category?: string;
    price: number;
    seller_details?: {
      seller_name?: string;
      seller_address?: string;
      seller_state?: string;
      gstin_number?: string;
    };
    taxes?: {
      cgst?: number;
      sgst?: number;
      igst?: number;
      total_tax?: number;
    };
    additional_details?: {
      requires_extra_care?: "True" | "False";
      type_extra_care?: string;
      quantity?: number;
    };
  }[];
};
