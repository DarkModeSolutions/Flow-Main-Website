"use client";

import CheckoutMethodModal from "@/components/CheckoutMethodModal";
import FlowButton from "@/components/FlowButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProductContext } from "@/contexts/ProductContext";
import { SessionUser } from "@/types/types";
import { images } from "@/utils/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CartClient = ({ user }: { user: SessionUser | undefined }) => {
  // console.log("CartClient for user:", user);

  const router = useRouter();

  const {
    products,
    incrementCartItem,
    decrementCartItem,
    cart,
    removeFromCart,
    clearCart,
  } = useProductContext();

  // Calculate total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const product = products?.find((prod) => prod.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  return (
    <div className="w-full min-h-screen p-10">
      <div className="flex justify-between items-center gap-6 mb-14">
        <h1 className="md:text-3xl text-2xl font-bold">Your Cart</h1>
        <div className="md:w-[20%] w-[50%]">
          <FlowButton label="Clear Cart" onClickHandler={() => clearCart()} />
        </div>
      </div>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="border p-4 rounded-lg flex flex-col gap-4 md:w-[70%] w-full mx-auto my-5">
            {cart.map((item) => {
              const product = products?.find(
                (prod) => prod.id === item.productId
              );

              if (!product) return null;

              return (
                <div
                  className="border p-4 rounded-lg md:flex md:justify-between md:items-center md:gap-4"
                  key={item.productId}
                >
                  {/* Product Image */}
                  <div className="md:w-[120px] w-full not-md:mb-10 h-[120px] relative flex-shrink-0">
                    <Image
                      src={images[product.imageUrl as keyof typeof images]}
                      alt={product.name}
                      fill
                      className="object-contain h-full w-full"
                      priority={true}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 not-md:w-full">
                    <h3 className="font-semibold md:text-lg text-sm not-md:text-center not-md:mb-5">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 not-md:hidden">
                      Price:{" "}
                      {product.price.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </p>
                    <p className="text-gray-600 not-md:hidden">
                      Quantity: {item.quantity}
                    </p>
                    <div className="md:hidden flex justify-between w-full mb-4">
                      <p className="text-gray-600">
                        Price:{" "}
                        {product.price.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </p>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold not-md:text-center not-md:mb-5">
                      Subtotal:{" "}
                      {(product.price * item.quantity).toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center not-md:justify-center not-md:mb-5 gap-3">
                    <div className="flex items-center md:w-[20%] order-last">
                      <FlowButton
                        onClickHandler={() => {
                          decrementCartItem(product.id);
                        }}
                      >
                        <span className="text-black">-</span>
                      </FlowButton>
                    </div>

                    <span className="mx-2 font-semibold order-2">
                      {item.quantity}
                    </span>

                    <div className="flex items-center w-[20%] order-first">
                      <FlowButton
                        onClickHandler={() => {
                          incrementCartItem(product.id);
                        }}
                      >
                        <span className="text-black">+</span>
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
          <div className="md:w-[40%] w-[90%] mx-auto border-t pt-4">
            <div className="mb-4">
              <h2 className="text-2xl text-center font-bold">
                Total:{" "}
                {getTotalPrice().toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </h2>
              <div className="w-[100%]">
                <div className="w-[60%] mx-auto flex flex-col gap-4 mt-4">
                  <FlowButton onClickHandler={() => router.push("/shop")}>
                    Continue Shopping
                  </FlowButton>
                  {user && user.email ? (
                    <Button className="bg-[#24bfcf] rounded-4xl p-4 text-black w-full hover:bg-[#24bfcf] hover:opacity-80 transition-opacity duration-200 cursor-pointer">
                      Checkout
                    </Button>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-[#24bfcf] rounded-4xl p-4 text-black w-full hover:bg-[#24bfcf] hover:opacity-80 transition-opacity duration-200 cursor-pointer">
                          Checkout
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-black p-10">
                        <DialogTitle>Choose your Method</DialogTitle>
                        <CheckoutMethodModal />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartClient;
