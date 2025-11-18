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
