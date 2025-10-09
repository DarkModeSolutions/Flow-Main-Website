// "use client";

// import React, { useRef } from "react";
// import Autoplay from "embla-carousel-autoplay";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";
// import { ProductDetailsWithIncludes } from "@/types/types";
// import { Skeleton } from "@/components/ui/skeleton";

// const HomePageCarousel = ({
//   products,
//   loading,
//   startAutoplay = true,
// }: {
//   products: ProductDetailsWithIncludes[];
//   loading: boolean;
//   startAutoplay?: boolean;
// }) => {
//   console.log("HomePageCarousel products:", products);

//   const plugin = useRef(
//     Autoplay({
//       delay: 2000,
//       stopOnInteraction: false,
//       active: startAutoplay,
//     })
//   );

//   // Show loading state
//   if (loading) {
//     return (
//       <div className="w-full flex flex-col items-center justify-center p-4">
//         <Skeleton className="w-full h-[200px] mb-2" />
//         <Skeleton className="w-full h-[200px]" />
//       </div>
//     );
//   }

//   const tempProducts = [
//     {
//       id: "1",
//       name: "Sample Product 1",
//       description: "This is a sample product description 1.",
//       price: 99.99,
//       stock: 10,
//       imageUrl: "",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       id: "2",
//       name: "Sample Product 2",
//       description: "This is a sample product description 2.",
//       price: 99.99,
//       stock: 10,
//       imageUrl: "",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       id: "3",
//       name: "Sample Product 3",
//       description: "This is a sample product description 3.",
//       price: 99.99,
//       stock: 10,
//       imageUrl: "",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//   ];

//   // Show empty state
//   if (!products || products.length === 0) {
//     // return (
//     //   <div className="w-full flex items-center justify-center p-4">
//     //     <p className="text-gray-500">No products available</p>
//     //   </div>
//     // );
//     products = tempProducts;
//   }

//   return (
//     <div className="w-full h-full p-4">
//       <Carousel
//         plugins={[plugin.current]}
//         className="w-full max-w-md mx-auto"
//         opts={{
//           align: "start",
//           loop: true,
//         }}
//       >
//         <CarouselContent>
//           {tempProducts.map((product) => (
//             <CarouselItem key={product.id}>
//               <div className="p-4 border rounded-lg">
//                 <div className="mb-2">
//                   <h3 className="text-lg font-semibold">{product.name}</h3>
//                 </div>
//                 <div>
//                   <p className="text-gray-600">{product.description}</p>
//                   <p className="text-xl font-bold mt-2">${product.price}</p>
//                 </div>
//               </div>
//             </CarouselItem>
//           ))}
//         </CarouselContent>
//       </Carousel>
//     </div>
//   );
// };

// export default HomePageCarousel;

// "use client";

// import React, { useRef, useEffect } from "react";
// import Autoplay from "embla-carousel-autoplay";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";
// import { ProductDetailsWithIncludes } from "@/types/types";
// import { Skeleton } from "@/components/ui/skeleton";
// import { type CarouselApi } from "@/components/ui/carousel";

// const HomePageCarousel = ({
//   products,
//   loading,
//   shouldStart = false,
// }: {
//   products: ProductDetailsWithIncludes[];
//   loading: boolean;
//   shouldStart?: boolean;
// }) => {
//   const [api, setApi] = React.useState<CarouselApi>();

//   const plugin = useRef(
//     Autoplay({
//       delay: 2000,
//       stopOnInteraction: false,
//       active: false, // Start disabled
//     })
//   );

//   // Control when autoplay starts
//   useEffect(() => {
//     if (shouldStart && api && plugin.current) {
//       // Start autoplay when shouldStart becomes true
//       plugin.current.reset(); // Reset to beginning
//       plugin.current.play(); // Start autoplay
//     }
//   }, [shouldStart, api]);

//   // Show loading state
//   if (loading) {
//     return (
//       <div className="w-full flex flex-col items-center justify-center p-4">
//         <Skeleton className="w-full h-[200px] mb-2" />
//         <Skeleton className="w-full h-[200px]" />
//       </div>
//     );
//   }

//   const tempProducts = [
//     {
//       id: "1",
//       name: "Sample Product 1",
//       description: "This is a sample product description 1.",
//       price: 99.99,
//       stock: 10,
//       imageUrl: "",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       id: "2",
//       name: "Sample Product 2",
//       description: "This is a sample product description 2.",
//       price: 99.99,
//       stock: 10,
//       imageUrl: "",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       id: "3",
//       name: "Sample Product 3",
//       description: "This is a sample product description 3.",
//       price: 99.99,
//       stock: 10,
//       imageUrl: "",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//   ];

//   const displayProducts = products.length > 0 ? products : tempProducts;

//   return (
//     <div className="w-full h-full p-4">
//       <Carousel
//         setApi={setApi}
//         plugins={[plugin.current]}
//         className="w-full max-w-md mx-auto"
//         opts={{
//           align: "start",
//           loop: true,
//         }}
//       >
//         <CarouselContent>
//           {displayProducts.map((product) => (
//             <CarouselItem key={product.id}>
//               <div className="p-4 border rounded-lg">
//                 <div className="mb-2">
//                   <h3 className="text-lg font-semibold">{product.name}</h3>
//                 </div>
//                 <div>
//                   <p className="text-gray-600">{product.description}</p>
//                   <p className="text-xl font-bold mt-2">${product.price}</p>
//                 </div>
//               </div>
//             </CarouselItem>
//           ))}
//         </CarouselContent>
//       </Carousel>
//     </div>
//   );
// };

// export default HomePageCarousel;

"use client";

import React, { useRef, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ProductDetailsWithIncludes } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";
import { type CarouselApi } from "@/components/ui/carousel";
import { tempProducts } from "@/utils/constants";

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

  // const tempProducts = [
  //   {
  //     id: "1",
  //     name: "Sample Product 1",
  //     description: "This is a sample product description 1.",
  //     price: 99.99,
  //     stock: 10,
  //     imageUrl: "",
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  //   {
  //     id: "2",
  //     name: "Sample Product 2",
  //     description: "This is a sample product description 2.",
  //     price: 99.99,
  //     stock: 10,
  //     imageUrl: "",
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  //   {
  //     id: "3",
  //     name: "Sample Product 3",
  //     description: "This is a sample product description 3.",
  //     price: 99.99,
  //     stock: 10,
  //     imageUrl: "",
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  // ];

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
