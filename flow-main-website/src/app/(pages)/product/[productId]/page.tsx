"use client";

import ErrorComponent from "@/components/ErrorComponent";
import FlowButton from "@/components/FlowButton";
import { Skeleton } from "@/components/ui/skeleton";
import useGetProductById from "@/hooks/useGetProductById";
import { ProductDetailsWithIncludes } from "@/types/types";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProductPage = () => {
  const params = useParams();
  const productId = params.productId as string;

  const [product, setProduct] = useState<ProductDetailsWithIncludes | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(1);

  const { error, getProductById, loading } = useGetProductById();

  useEffect(() => {
    async function fetchProduct(productId: string) {
      const prod = await getProductById(productId);

      if (prod === null) {
        setProduct(null);
        console.log("Product not found: ", error);
        return;
      }

      setProduct(prod);
    }

    if (productId) {
      fetchProduct(productId);
    }
  }, [error, getProductById, productId]);

  if (error || product === null) {
    return <ErrorComponent error={error} />;
  }

  if (loading) {
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
    <div className="w-full min-h-screen flex flex-col items-center space-y-3 p-4">
      <div className="h-[30vh] w-full">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.name} fill className="" />
        ) : (
          <p>No Image Available</p>
        )}
      </div>
      <div className="flex justify-between w-full items-start">
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
      <div className="w-full flex justify-between items-start space-x-4">
        <div className="w-[70%] h-auto">
          <p>
            {product.description
              ? product.description
              : "No description available."}
          </p>
        </div>
        <div className="flex-1 flex flex-col space-y-2">
          <div className="w-full flex justify-between items-center">
            <div className="w-[25%]  order-first">
              <FlowButton onClickHandler={() => setQuantity(quantity + 1)}>
                <span>+</span>
              </FlowButton>
            </div>
            <div className="w-[25%] order-last">
              <FlowButton
                onClickHandler={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <span>-</span>
              </FlowButton>
            </div>
            <div className="flex-1 flex justify-center items-center order-2">
              <span>{quantity}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
