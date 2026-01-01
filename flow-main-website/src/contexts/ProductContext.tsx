"use client";

import useGetAllProducts from "@/hooks/useGetAllProducts";
import { AllProductDetails, BundleCartItem, Cart, ProductContextType } from "@/types/types";
import React, { createContext, useEffect, useState } from "react";

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [products, setProducts] = useState<AllProductDetails[]>([]);
  const [cart, setCart] = useState<Cart[] | []>([]);
  const [bundleCart, setBundleCart] = useState<BundleCartItem[]>([]);

  const { error, getAllProducts, loading } = useGetAllProducts();

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        console.log("Cart loaded from localStorage:", parsedCart);
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        localStorage.removeItem("cart"); // Remove corrupted data
      }
    }

    // Load bundle cart from localStorage
    const savedBundleCart = localStorage.getItem("bundleCart");
    if (savedBundleCart) {
      try {
        const parsedBundleCart = JSON.parse(savedBundleCart);
        setBundleCart(parsedBundleCart);
        console.log("Bundle cart loaded from localStorage:", parsedBundleCart);
      } catch (error) {
        console.error("Error parsing bundle cart from localStorage:", error);
        localStorage.removeItem("bundleCart");
      }
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Cart saved to localStorage:", cart);
  }, [cart]);

  // Save bundle cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("bundleCart", JSON.stringify(bundleCart));
    console.log("Bundle cart saved to localStorage:", bundleCart);
  }, [bundleCart]);

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

  const getCartItemQuantity = (productId: string): number => {
    const item = cart.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const addToCart = ({ productId, quantity }: Cart): number => {
    const existingItemInCart = cart.findIndex(
      (item) => item.productId === productId
    );

    let newQuantity = 0;

    if (existingItemInCart !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemInCart].quantity += quantity;

      if (updatedCart[existingItemInCart].quantity <= 0) {
        updatedCart.splice(existingItemInCart, 1);
        newQuantity = 0;
      } else {
        newQuantity = updatedCart[existingItemInCart].quantity;
      }

      setCart(updatedCart);
    } else if (quantity > 0) {
      const newCart = [...cart, { productId, quantity }];
      setCart(newCart);
      newQuantity = quantity;
    }

    return newQuantity;
  };

  const incrementCartItem = (productId: string): number => {
    return addToCart({ productId, quantity: 1 });
  };

  const decrementCartItem = (productId: string): number => {
    return addToCart({ productId, quantity: -1 });
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter((item) => item.productId !== productId);
    setCart(updatedCart);
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    setBundleCart([]);
    localStorage.removeItem("cart");
    localStorage.removeItem("bundleCart");
  };

  // Bundle cart functions
  const addBundleToCart = (bundle: BundleCartItem) => {
    setBundleCart((prev) => [...prev, bundle]);
  };

  const removeBundleFromCart = (bundleId: string) => {
    setBundleCart((prev) => prev.filter((item) => item.bundleId !== bundleId));
  };

  const clearBundleCart = () => {
    setBundleCart([]);
    localStorage.removeItem("bundleCart");
  };

  return (
    <ProductContext.Provider
      value={{
        products: products ? products : [],
        error,
        loading,
        addToCart,
        removeFromCart,
        cart,
        getCartItemQuantity,
        incrementCartItem,
        decrementCartItem,
        clearCart,
        bundleCart,
        addBundleToCart,
        removeBundleFromCart,
        clearBundleCart,
      }}
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
