"use client";

import ErrorComponent from "@/components/ErrorComponent";
import FlowButton from "@/components/FlowButton";
import HomePageCarousel from "@/components/HomePageCarousel";
import { useProductContext } from "@/contexts/ProductContext";
// import useGetAllProducts from "@/hooks/useGetAllProducts";
// import { ProductDetailsWithIncludes } from "@/types/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";

const MainPage = () => {
  const router = useRouter();
  const { products, error, loading } = useProductContext();
  const [shouldStart, setShouldStart] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // useEffect(() => {
  //   // Start both video and carousel together after components mount
  //   const timer = setTimeout(() => {
  //     setShouldStart(true);

  //     // Manually start video
  //     if (videoRef.current) {
  //       videoRef.current.currentTime = 0; // Reset to start
  //       videoRef.current.play().catch(console.error);
  //     }
  //   }, 300); // Small delay to ensure everything is mounted

  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    // Only start video and carousel after products are loaded (not loading and no error)
    if (!loading && !error && products && products.length > 0) {
      const timer = setTimeout(() => {
        setShouldStart(true);

        // Manually start video
        if (videoRef.current) {
          videoRef.current.currentTime = 0; // Reset to start
          videoRef.current.play().catch(console.error);
        }
      }, 300); // Small delay to ensure everything is mounted

      return () => clearTimeout(timer);
    }
  }, [loading, error, products]); // Add dependencies to watch for data changes

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return (
    <div className="w-full">
      <div className="w-full flex">
        <div className="w-1/2 h-[500px]">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            loop
            muted
            playsInline
            preload="auto"
            // Remove autoPlay - we'll control it manually
          >
            <source
              src="/assets/videos/carousel animation.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="w-1/2">
          <HomePageCarousel
            loading={loading}
            products={products}
            shouldStart={shouldStart} // Pass the trigger
          />
        </div>
      </div>
      <div className="w-[20%] mx-auto my-4">
        <FlowButton
          label="Buy Now"
          onClickHandler={() => router.push("/shop")}
        />
      </div>
    </div>
  );
};

export default MainPage;
