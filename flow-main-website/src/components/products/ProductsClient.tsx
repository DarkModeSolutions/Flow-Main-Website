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
import { Skeleton } from "@/components/ui/skeleton";
import { useProductContext } from "@/contexts/ProductContext";
import useGetProductById from "@/hooks/useGetProductById";
import useInitiatePayment from "@/hooks/useInitiatePayment";
import { AllProductDetails, SessionUser } from "@/types/types";
import { images, videos } from "@/utils/constants";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const ProductsClient = ({ user }: { user: SessionUser | undefined }) => {
  console.log("User in product page: ", user);

  const params = useParams();
  const productId = params.productId as string;

  const [product, setProduct] = useState<AllProductDetails | null>(null);
  const [showVid, setShowVid] = useState<boolean>(false);
  const [videoPlayedOnce, setVideoPlayedOnce] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { error, getProductById, loading } = useGetProductById();

  const {
    cart,
    addToCart,
    getCartItemQuantity,
    incrementCartItem,
    decrementCartItem,
  } = useProductContext();

  const {
    error: paymentError,
    initiatePayment,
    loading: paymentLoading,
  } = useInitiatePayment();

  const [quantityInCart, setQuantityInCart] = useState<number>(
    getCartItemQuantity(productId) || 0
  );

  // Update quantity when cart changes or component mounts
  useEffect(() => {
    setQuantityInCart(getCartItemQuantity(productId));
  }, [cart, productId, getCartItemQuantity]);

  // Separate useEffect for fetching product (removed videoPlayedOnce from dependencies)
  useEffect(() => {
    async function fetchProduct(productId: string) {
      const prod = await getProductById(productId);

      if (prod === null) {
        setProduct(null);
        console.log("Product not found: ", error);
        return;
      }

      setProduct(prod);
      console.log("Fetched Product: ", prod);
    }

    if (productId) {
      fetchProduct(productId);
    }
  }, [error, getProductById, productId]); // Removed videoPlayedOnce

  // Separate useEffect for handling video start (only when product changes)
  useEffect(() => {
    if (
      product &&
      product.imageUrl &&
      videos[product.imageUrl as keyof typeof videos] &&
      !videoPlayedOnce
    ) {
      setShowVid(true);

      // Play video after a short delay to ensure it's rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(console.error);
        }
      }, 100);
    }
  }, [product, videoPlayedOnce]); // Only depend on product and videoPlayedOnce

  const handleVideoEnd = () => {
    setShowVid(false);
    setVideoPlayedOnce(true); // Mark video as played
  };

  // Handle Add to Cart (no longer triggers video)
  const handleAddToCart = () => {
    const newQuantity = addToCart({
      productId: product!.id,
      quantity: 1,
    });
    setQuantityInCart(newQuantity);
  };

  const handleClick = async () => {
    if (!product) return;

    if (!user?.address) {
      alert("Please set an address");
      return;
    }

    let effectiveQuantity = quantityInCart;
    if (effectiveQuantity === 0) {
      effectiveQuantity = 1; // Ensure at least 1 item is purchased
    }

    const response = await initiatePayment({
      amount: product.price * effectiveQuantity,
      description: `Purchase of ${product.name}`,
      userId: user?.id,
      cart: [{ productId: product.id, quantity: effectiveQuantity }],
    });

    if (typeof response === "string") {
      window.location.href = response;
    } else {
      alert("Failed to start payment. Please try again.");
    }
  };

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (loading || product === null) {
    return (
      <div className="w-full h-screen flex flex-col items-center space-y-3 p-4">
        <div className="h-[30vh] w-full">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="flex justify-between w-full items-start">
          <div className="w-[50%]">
            <Skeleton className="w-full h-8 mb-2" />
          </div>
          <div className="w-[20%]">
            <Skeleton className="w-full h-4" />
          </div>
        </div>
        <div className="w-full flex-1 flex justify-between items-start space-x-4">
          <div className="w-[70%] h-full">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="flex-1 h-full flex flex-col space-y-2">
            <Skeleton className="w-full h-[30%]" />
            <Skeleton className="w-full h-[30%]" />
            <Skeleton className="w-full h-[30%]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-row not-md:flex-col items-center space-y-3 p-4">
      <div className="h-[30vh] w-full relative md:w-[60%]">
        {showVid &&
        product.imageUrl &&
        videos[product.imageUrl as keyof typeof videos] &&
        !videoPlayedOnce ? (
          // Show video only once on initial load
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            onEnded={handleVideoEnd}
            muted
            playsInline
            // Removed loop - video plays once and ends
          >
            <source
              src={videos[product.imageUrl as keyof typeof videos]}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        ) : product.imageUrl ? (
          // Show image by default or after video ends
          <Image
            src={images[product.imageUrl as keyof typeof images]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain h-full w-full"
            priority={true}
          />
        ) : (
          <p>No Image Available</p>
        )}
      </div>
      <div className="flex md:flex-col not-md:flex-col md:gap-y-3 mt-5">
        <div className="flex justify-between w-full md:items-start items-center">
          <div className="w-[50%]">
            <h2 className="manrope manrope-semibold text-[#24BFCF] text-2xl">
              {product.name}
            </h2>
          </div>
          <div className="w-[20%]">
            <h2 className="manrope manrope-semibold text-[#24BFCF] text-lg">
              {product.price.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </h2>
          </div>
        </div>
        <div className="w-full flex justify-between items-start space-x-4 md:space-x-8 not-md:mt-8">
          <div className="w-[70%] h-auto not-md:w-[50%] not-md:text-sm md:pr-20">
            <p>
              {product.description
                ? product.description
                : "No description available."}
            </p>
          </div>
          <div className="flex-1 flex flex-col space-y-2">
            {product.stock > 0 ? (
              quantityInCart > 0 ? (
                // Show quantity controls when item is in cart
                <div className="w-full flex justify-between items-center">
                  <div className="w-[25%] order-first">
                    <FlowButton
                      onClickHandler={() => {
                        const newQuantity = incrementCartItem(product.id);
                        setQuantityInCart(newQuantity);
                      }}
                    >
                      <span>+</span>
                    </FlowButton>
                  </div>
                  <div className="w-[25%] order-last">
                    <FlowButton
                      onClickHandler={() => {
                        const newQuantity = decrementCartItem(product.id);
                        setQuantityInCart(newQuantity);
                      }}
                    >
                      <span>-</span>
                    </FlowButton>
                  </div>
                  <div className="flex-1 flex justify-center items-center order-2">
                    <span>{quantityInCart}</span>
                  </div>
                </div>
              ) : (
                // Show "Add to Cart" button when item not in cart
                <div className="w-full flex justify-center items-center">
                  <FlowButton onClickHandler={handleAddToCart}>
                    Add to Cart
                  </FlowButton>
                </div>
              )
            ) : (
              <div className="w-full flex justify-center items-center">
                <span className="text-red-500">Out of Stock</span>
              </div>
            )}
            <div className="w-full flex justify-center items-center">
              {user && user.email ? (
                <FlowButton
                  isDisabled={!(product.stock > 0)}
                  onClickHandler={handleClick}
                >
                  {paymentLoading ? "Processing..." : "Pre Order Now"}
                </FlowButton>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#24bfcf] rounded-4xl p-4 text-black w-full hover:bg-[#24bfcf] hover:opacity-80 transition-opacity duration-200 cursor-pointer">
                      {"Pre Order Now"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-black p-10">
                    <DialogTitle>Choose your Method</DialogTitle>
                    <CheckoutMethodModal />
                  </DialogContent>
                </Dialog>
              )}
            </div>
            {paymentError && (
              <div className="text-red-500 text-center">{`${paymentError}`}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsClient;
