"use client";
import CheckoutMethodModal from "@/components/CheckoutMethodModal";
import ErrorComponent from "@/components/ErrorComponent";
import FlowButton from "@/components/FlowButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useProductContext } from "@/contexts/ProductContext";
import useGetUserAddressDetails from "@/hooks/useGetUserAddressDetails";
import useInitiatePayment from "@/hooks/useInitiatePayment";
import { AddressAllDetails, SessionUser } from "@/types/types";
import { bundleImages, images } from "@/utils/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const CartClient = ({ user }: { user: SessionUser | undefined }) => {
  const router = useRouter();

  const {
    products,
    incrementCartItem,
    decrementCartItem,
    cart,
    removeFromCart,
    clearCart,
    bundleCart,
    removeBundleFromCart,
  } = useProductContext();

  const [userAddresses, setUserAddresses] = useState<
    AddressAllDetails[] | [] | null
  >(null);
  const [orderAddressId, setOrderAddressId] = useState<string | null>(null);

  const { error, loading, initiatePayment } = useInitiatePayment();
  const {
    error: getUserAddressDetailsError,
    loading: getUserAddressDetailsLoading,
    getUserAddressDetails,
  } = useGetUserAddressDetails();

  // Calculate total price including bundles
  const getTotalPrice = useCallback(() => {
    const cartTotal = cart.reduce((total, item) => {
      const product = products?.find((prod) => prod.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);

    const bundleTotal = bundleCart.reduce((total, bundle) => {
      return total + bundle.totalPrice;
    }, 0);

    return cartTotal + bundleTotal;
  }, [cart, products, bundleCart]);

  const handleCheckout = async () => {
    const totalAmount = getTotalPrice();

    if (!user?.address) {
      alert("Please set a valid address");
      return;
    }

    // Convert bundle cart to regular cart items for the API
    const bundleAsCartItems = bundleCart.flatMap((bundle) =>
      bundle.flavors.map((productId) => ({
        productId,
        quantity: 1,
        isBundle: true,
        bundleId: bundle.bundleId,
        bundleSize: bundle.bundleSize,
        pricePerPack: bundle.pricePerPack,
      }))
    );

    const allCartItems = [...cart, ...bundleAsCartItems];

    const response = await initiatePayment({
      cart: allCartItems,
      amount: totalAmount,
      description: "Cart purchase from FlowHydration",
      userId: user?.id,
      orderAddressId: orderAddressId,
      bundleCart: bundleCart,
    });

    if (typeof response === "string") {
      window.location.href = response;
    } else {
      alert("Failed to start payment. Please try again.");
    }
  };

  const handleSelectAddress = async () => {
    if (user) {
      const addressesResponse = await getUserAddressDetails(user.id);
      setUserAddresses(addressesResponse);
    } else {
      alert("Please log in to select an address.");
      return;
    }
  };

  if (getUserAddressDetailsError) {
    <ErrorComponent error={getUserAddressDetailsError} />;
  }
  return (
    <div className="w-full min-h-screen p-10">
      <div className="flex justify-between items-center gap-6 mb-14">
        <h1 className="md:text-3xl text-2xl font-bold">Your Cart</h1>
        <div className="md:w-[20%] w-[50%]">
          <FlowButton label="Clear Cart" onClickHandler={() => clearCart()} />
        </div>
      </div>

      {cart.length === 0 && bundleCart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="border p-4 rounded-lg flex flex-col gap-4 md:w-[70%] w-full mx-auto my-5">
            {/* Regular Cart Items */}
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
                  <div className="md:w-[120px] w-full not-md:mb-10 h-[120px] relative shrink-0">
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
                    <div className="flex items-center md:w-[20%] order-first">
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

                    <div className="flex items-center w-[20%] order-last">
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

            {/* Bundle Cart Items */}
            {bundleCart.map((bundle) => {
              const flavorNames = bundle.flavors.map((flavorId) => {
                const product = products?.find((p) => p.id === flavorId);
                return product?.name || "Unknown Flavor";
              });

              const firstFlavorProduct = products?.find(
                (p) => p.id === bundle.flavors[0]
              );
              const bundleImageUrl =
                firstFlavorProduct?.imageUrl &&
                bundleImages[
                  firstFlavorProduct.imageUrl as keyof typeof bundleImages
                ]
                  ? bundleImages[
                      firstFlavorProduct.imageUrl as keyof typeof bundleImages
                    ]
                  : null;

              return (
                <div
                  className="border-2 border-[#BFFF00]/50 bg-[#BFFF00]/5 p-4 rounded-lg md:flex md:justify-between md:items-center md:gap-4"
                  key={bundle.bundleId}
                >
                  {/* Bundle Image */}
                  <div className="md:w-[120px] w-full not-md:mb-10 h-[120px] relative shrink-0">
                    {bundleImageUrl ? (
                      <Image
                        src={bundleImageUrl}
                        alt={`Bundle of ${bundle.bundleSize}`}
                        fill
                        className="object-contain h-full w-full"
                        priority={true}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-b from-[#24BFCF] to-[#1a8a96] rounded-md flex items-center justify-center text-white font-bold">
                        x{bundle.bundleSize}
                      </div>
                    )}
                    {/* Bundle badge */}
                    <div className="absolute -top-2 -right-2 bg-[#BFFF00] text-black text-xs font-bold px-2 py-1 rounded-full">
                      Bundle
                    </div>
                  </div>

                  {/* Bundle Info */}
                  <div className="flex-1 not-md:w-full">
                    <h3 className="font-semibold md:text-lg text-sm not-md:text-center not-md:mb-3">
                      Bundle Pack of {bundle.bundleSize}
                    </h3>
                    <div className="text-sm text-gray-400 not-md:text-center not-md:mb-3">
                      {flavorNames.map((name, idx) => (
                        <span key={idx}>
                          {name}
                          {idx < flavorNames.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 items-center not-md:justify-center">
                      <p className="text-gray-400 text-sm line-through">
                        ₹
                        {(
                          bundle.originalPricePerPack * bundle.bundleSize
                        ).toLocaleString("en-IN")}
                      </p>
                      <p className="text-[#BFFF00] text-sm font-semibold">
                        Save{" "}
                        {Math.round(
                          ((bundle.originalPricePerPack - bundle.pricePerPack) /
                            bundle.originalPricePerPack) *
                            100
                        )}
                        %
                      </p>
                    </div>
                    <p className="font-semibold not-md:text-center not-md:mt-3 text-white">
                      Total:{" "}
                      {bundle.totalPrice.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <div>
                    <FlowButton
                      onClickHandler={() => {
                        removeBundleFromCart(bundle.bundleId);
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
              <div className="w-full">
                <div className="w-[60%] mx-auto flex flex-col gap-4 mt-4">
                  <FlowButton onClickHandler={() => router.push("/shop")}>
                    Continue Shopping
                  </FlowButton>
                  {user && user.email ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          // disabled={loading}
                          onClick={() => handleSelectAddress()}
                          className="bg-[#24bfcf] rounded-4xl p-4 text-black w-full hover:bg-[#24bfcf] hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                        >
                          Checkout
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-black p-10">
                        <DialogTitle>Choose your Address</DialogTitle>
                        {getUserAddressDetailsLoading ? (
                          <div className="w-full h-full flex justify-center items-center">
                            <Spinner />
                          </div>
                        ) : userAddresses && userAddresses.length > 0 ? (
                          userAddresses.map((address) => (
                            <div
                              onClick={() =>
                                setOrderAddressId((prev) =>
                                  prev === address.id ? null : address.id
                                )
                              }
                              key={address.id}
                              className={`border-2 p-2 rounded-lg cursor-pointer ${
                                orderAddressId === address.id
                                  ? "border-blue-500"
                                  : "border-white"
                              } mb-2`}
                            >
                              <p className="font-semibold">
                                {address.addressName}
                              </p>
                              <p>
                                {address.addressLine1}, {address.addressLine2},{" "}
                                {address.city} - {address.pincode}
                              </p>
                            </div>
                          ))
                        ) : (
                          "No addresses found. Please add an address in your profile."
                        )}
                        <Button
                          disabled={loading || orderAddressId === null}
                          onClick={() => handleCheckout()}
                          className="bg-[#24bfcf] rounded-4xl p-4 text-black w-full hover:bg-[#24bfcf] hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                        >
                          {loading ? "Processing..." : "Checkout"}
                        </Button>
                      </DialogContent>
                    </Dialog>
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
                  {error && (
                    <div className="text-red-500 text-center">{`${error}`}</div>
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
