"use client";

import ErrorComponent from "@/components/ErrorComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductContext } from "@/contexts/ProductContext";
import { images } from "@/utils/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ShopPage = () => {
  const router = useRouter();

  const { error, loading, products } = useProductContext();

  console.log("Products in ShopPage: ", products);

  if (error) {
    return <ErrorComponent error={error} />;
  }
  return (
    <div className="w-full flex flex-col pt-4 gap-8 px-4 sm:px-0">
      <h2 className="manrope manrope-bold text-[#24BFCF] text-2xl mb-5">
        Shop for our Products
      </h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-20">
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
        {!loading && products && products.length > 0
          ? products.map((product) => (
              <div
                onClick={() => router.push(`/product/${product.id}`)}
                key={product.id} // ✅ Use product.id instead of index
                className="w-full h-[300px] flex flex-col cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-full flex-1 relative overflow-hidden">
                  {product.imageUrl &&
                  product.imageUrl in images &&
                  images[product.imageUrl as keyof typeof images] ? (
                    <Image
                      src={images[product.imageUrl as keyof typeof images]}
                      alt={product.name}
                      fill
                      sizes=""
                      className="object-contain bg-transparent" // ✅ Use className instead of style
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <p>No Image Available</p>
                    </div>
                  )}
                </div>
                <div className="p-2 mt-4">
                  <p className="font-semibold text-sm truncate text-center">
                    {product.name}
                  </p>
                  <p className="text-gray-600 text-xs text-center">
                    {product.price.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </p>
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
