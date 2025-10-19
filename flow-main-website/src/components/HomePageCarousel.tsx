"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductDetailsWithIncludes } from "@/types/types";
import { tempProducts } from "@/utils/constants";
import React, { useEffect, useRef } from "react";

const HomePageCarousel = ({
  products,
  loading,
  shouldStart = false,
}: {
  products: ProductDetailsWithIncludes[] | null;
  loading: boolean;
  shouldStart?: boolean;
}) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Custom autoplay implementation
  useEffect(() => {
    if (!shouldStart || !api) return;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start autoplay
    intervalRef.current = setInterval(() => {
      api.scrollNext();
    }, 3000); // 3 seconds to match video

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [shouldStart, api]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-4">
        <Skeleton className="w-full h-[200px] mb-2" />
        <Skeleton className="w-full h-[200px]" />
      </div>
    );
  }

  if (products === null) {
    products = [];
  }

  const displayProducts = products.length > 0 ? products : tempProducts;

  return (
    <div className="w-full h-full p-4">
      <Carousel
        setApi={setApi}
        // Remove plugins - we're using custom autoplay
        className="w-full max-w-md mx-auto"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {displayProducts.map((product) => (
            <CarouselItem key={product.id}>
              <div className="p-4 border rounded-lg">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                </div>
                <div>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-xl font-bold mt-2">${product.price}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default HomePageCarousel;
