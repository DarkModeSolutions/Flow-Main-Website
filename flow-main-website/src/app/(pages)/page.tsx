// "use client";

// import HomePageCarousel from "@/components/HomePageCarousel";
// import useGetAllProducts from "@/hooks/useGetAllProducts";
// import { ProductDetailsWithIncludes } from "@/types/types";
// import React, { useEffect, useState } from "react";

// const MainPage = () => {
//   const [products, setproducts] = useState<
//     ProductDetailsWithIncludes[] | null | undefined
//   >(null);

//   const { loading, getAllProducts } = useGetAllProducts();

//   useEffect(() => {
//     async function fetchProducts() {
//       const fetchedProducts = await getAllProducts();
//       setproducts(fetchedProducts);
//     }

//     fetchProducts();
//   }, [getAllProducts]);

//   return (
//     <div className="w-full">
//       <div className="w-full flex">
//         <div className="w-1/2 h-[500px]">
//           <video
//             className="w-full h-full object-cover"
//             autoPlay
//             loop
//             muted
//             playsInline
//           >
//             <source
//               src="/assets/videos/carousel animation.mp4"
//               type="video/mp4"
//             />
//             Your browser does not support the video tag.
//           </video>
//         </div>
//         <div>
//           <HomePageCarousel loading={loading} products={products!} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainPage;

// "use client";

// import HomePageCarousel from "@/components/HomePageCarousel";
// import useGetAllProducts from "@/hooks/useGetAllProducts";
// import { ProductDetailsWithIncludes } from "@/types/types";
// import React, { useEffect, useState } from "react";

// const MainPage = () => {
//   const [products, setProducts] = useState<ProductDetailsWithIncludes[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [isReady, setIsReady] = useState(false);

//   const { loading, getAllProducts } = useGetAllProducts();

//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         const fetchedProducts = await getAllProducts();
//         if (fetchedProducts) {
//           setProducts(fetchedProducts);
//         }
//       } catch (err) {
//         setError("Failed to load products");
//         console.error("Error fetching products:", err);
//       }
//     }

//     fetchProducts();
//   }, [getAllProducts]);

//   useEffect(() => {
//     // Give components time to mount
//     const timer = setTimeout(() => {
//       setIsReady(true);
//     }, 200);

//     return () => clearTimeout(timer);
//   }, []);

//   console.log("MainPage products:", products);

//   if (error) {
//     return (
//       <div className="w-full flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
//           <p className="text-gray-600">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       <div className="w-full flex">
//         <div className="w-1/2 h-[500px]">
//           {!products || products.length === 0 ? null : (
//             <video
//               className="w-full h-full object-cover"
//               autoPlay
//               loop
//               muted
//               playsInline
//             >
//               <source
//                 src="/assets/videos/carousel animation.mp4"
//                 type="video/mp4"
//               />
//               Your browser does not support the video tag.
//             </video>
//           )}
//         </div>
//         <div className="w-1/2">
//           <HomePageCarousel
//             loading={loading}
//             products={products}
//             startAutoplay={isReady}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainPage;

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

  // const [products, setProducts] = useState<ProductDetailsWithIncludes[]>([]);
  // const [error, setError] = useState<string | null>(null);
  const [shouldStart, setShouldStart] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Start both video and carousel together after components mount
    const timer = setTimeout(() => {
      setShouldStart(true);

      // Manually start video
      if (videoRef.current) {
        videoRef.current.currentTime = 0; // Reset to start
        videoRef.current.play().catch(console.error);
      }
    }, 300); // Small delay to ensure everything is mounted

    return () => clearTimeout(timer);
  }, []);

  // const { loading, getAllProducts } = useGetAllProducts();

  // useEffect(() => {
  //   async function fetchProducts() {
  //     try {
  //       const fetchedProducts = await getAllProducts();
  //       if (fetchedProducts) {
  //         setProducts(fetchedProducts);
  //       }
  //     } catch (err) {
  //       setError("Failed to load products");
  //       console.error("Error fetching products:", err);
  //     }
  //   }

  //   fetchProducts();
  // }, [getAllProducts]);

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
