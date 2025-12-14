import { Prisma } from "@prisma/client";

// DB Payloads

export type OrderDetailsWithAdminIncludes = Prisma.OrdersGetPayload<{
  include: {
    orderItems: {
      include: {
        product: true;
      };
    };
    shadowfaxOrder: true;
  };
}>;

// Custom Admin Types

export type ProductRequest = {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
};

export type PromotionRequest = {
  code?: string;
  discount?: number;
  description?: string;
  validFrom?: string;
  validTo?: string;
  isActive?: boolean;
};
