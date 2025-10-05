"use client";

import FlowButton from "@/components/FlowButton";
import { useProductContext } from "@/contexts/ProductContext";
import { images } from "@/utils/constants";
import Image from "next/image";
import React from "react";

const Cart = () => {
  const {
    products,
    incrementCartItem,
    decrementCartItem,
    cart,
    removeFromCart,
  } = useProductContext();

  // Remove localStorage access - use cart from context instead
  // const cartFromLocalStorage = JSON.parse(localStorage.getItem("cart") || "[]");

  // Calculate total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const product = products?.find((prod) => prod.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  return (
    <div className="w-full min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="border p-4 rounded-lg flex flex-col gap-4 w-[70%] mx-auto my-5">
            {cart.map((item) => {
              const product = products?.find(
                (prod) => prod.id === item.productId
              );

              if (!product) return null;

              return (
                <div
                  className="border p-4 rounded-lg flex justify-between items-center gap-4"
                  key={item.productId}
                >
                  {/* Product Image */}
                  <div className="w-[120px] h-[120px] relative flex-shrink-0">
                    <Image
                      src={images[product.imageUrl as keyof typeof images]}
                      alt={product.name}
                      fill
                      className="object-contain h-full w-full"
                      priority={true}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-gray-600">
                      Price:{" "}
                      {product.price.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="font-semibold">
                      Subtotal:{" "}
                      {(product.price * item.quantity).toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center w-[20%]">
                      <FlowButton
                        onClickHandler={() => {
                          decrementCartItem(product.id);
                        }}
                      >
                        <span>-</span>
                      </FlowButton>
                    </div>

                    <span className="mx-2 font-semibold">{item.quantity}</span>

                    <div className="flex items-center w-[20%]">
                      <FlowButton
                        onClickHandler={() => {
                          incrementCartItem(product.id);
                        }}
                      >
                        <span>+</span>
                      </FlowButton>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div>
                    <FlowButton
                      onClickHandler={() => {
                        removeFromCart(product.id);
                      }}
                    >
                      Remove
                    </FlowButton>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="w-[40%] mx-auto border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                Total:{" "}
                {getTotalPrice().toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </h2>
              <div className="flex gap-4">
                <FlowButton>Continue Shopping</FlowButton>
                <FlowButton>Checkout</FlowButton>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
