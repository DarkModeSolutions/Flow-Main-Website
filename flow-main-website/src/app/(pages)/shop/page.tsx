"use client";

import ErrorComponent from "@/components/ErrorComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductContext } from "@/contexts/ProductContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const ShopPage = () => {
  const router = useRouter();

  const { error, loading, products } = useProductContext();

  if (error) {
    return <ErrorComponent error={error} />;
  }
  return (
    <div className="w-full">
      <h2 className="manrope manrope-semibold text-[#24BFCF] text-2xl mb-5">
        Shop
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {loading && (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="w-[30%] aspect-square flex flex-col space-y-2"
              >
                <Skeleton className="w-full h-[60%]" />
                <Skeleton className="w-full flex-1" />
              </div>
            ))}
          </>
        )}
        {!loading && products && products.length > 0 ? (
          products.map((product, index) => (
            <div
              onClick={() => router.push(`/product/${product.id}`)}
              key={index}
              className="w-[30%] aspect-square flex flex-col"
            >
              <div className="w-full h-[60%]">
                {product.imageUrl ? (
                  <Image src={product.imageUrl} alt={product.name} fill />
                ) : (
                  <p>No Image Available</p>
                )}
              </div>
              <p className="w-full flex-1">{product.name}</p>
            </div>
          ))
        ) : (
          <p className="text-2xl">No Products Listed</p>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
