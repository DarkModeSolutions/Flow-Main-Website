"use client";

import ErrorComponent from "@/components/ErrorComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductContext } from "@/contexts/ProductContext";
import { images } from "@/utils/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const ShopPage = () => {
  const router = useRouter();

  const { error, loading, products } = useProductContext();

  console.log("Products in ShopPage: ", products);

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
        {/* {!loading && products && products.length > 0 ? (
          products.map((product, index) => (
            <div
              onClick={() => router.push(`/product/${product.id}`)}
              key={index}
              className="w-[30%] aspect-square flex flex-col"
            >
              <div className="w-full h-[60%]">
                {product.imageUrl &&
                product.imageUrl in images &&
                images[product.imageUrl as keyof typeof images] ? (
                  <Image
                    src={images[product.imageUrl as keyof typeof images]}
                    alt={product.name}
                    fill
                    className="object-cover" // ✅ Use className instead of style
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <p>No Image Available</p>
                  </div>
                )}
              </div>
              <p className="w-full flex-1">{product.name}</p>
            </div>
          ))
        ) : (
          <p className="text-2xl">No Products Listed</p>
        )} */}
        {!loading && products && products.length > 0
          ? products.map((product) => (
              <div
                onClick={() => router.push(`/product/${product.id}`)}
                key={product.id} // ✅ Use product.id instead of index
                className="w-full aspect-square flex flex-col cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-full flex-1 relative rounded-lg overflow-hidden bg-gray-100">
                  {product.imageUrl &&
                  product.imageUrl in images &&
                  images[product.imageUrl as keyof typeof images] ? (
                    <Image
                      src={images[product.imageUrl as keyof typeof images]}
                      alt={product.name}
                      fill
                      sizes=""
                      className="object-cover" // ✅ Use className instead of style
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <p>No Image Available</p>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="font-semibold text-sm truncate">
                    {product.name}
                  </p>
                  <p className="text-gray-600 text-xs">${product.price}</p>
                </div>
              </div>
            ))
          : !loading && (
              <div className="col-span-full text-center py-8">
                <p className="text-2xl text-gray-500">No Products Listed</p>
              </div>
            )}
      </div>
    </div>
  );
};

export default ShopPage;
