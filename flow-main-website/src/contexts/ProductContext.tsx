"use client";

import useGetAllProducts from "@/hooks/useGetAllProducts";
import { ProductContextType, ProductDetailsWithIncludes } from "@/types/types";
import React, { createContext, useEffect, useState } from "react";

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [products, setProducts] = useState<ProductDetailsWithIncludes[]>([]);

  const { error, getAllProducts, loading } = useGetAllProducts();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getAllProducts();
      if (response !== null && response !== undefined && response?.length > 0) {
        setProducts(response);
      } else {
        setProducts([]);
      }
    };

    fetchProducts();
  }, [getAllProducts]);

  return (
    <ProductContext.Provider
      value={
        products
          ? { products, error, loading }
          : { products: [], error, loading }
      }
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = React.useContext(ProductContext);

  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }

  return context;
};
