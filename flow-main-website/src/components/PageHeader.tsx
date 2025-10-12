// "use client";

// import logo from "@/../public/assets/images/Flow Logo.png";
// import { Input } from "@/components/ui/input";
// import {
//   Sheet,
//   // SheetClose,
//   SheetContent,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { useProductContext } from "@/contexts/ProductContext";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { GiHamburgerMenu } from "react-icons/gi";
// import { IoCartOutline, IoPersonSharp } from "react-icons/io5";

// const PageHeader = () => {
//   const router = useRouter();

//   const { cart } = useProductContext();

//   const [isSheetOpen, setIsSheetOpen] = useState(false);

//   const handleNavigation = (href: string) => {
//     setIsSheetOpen(false); // Close sheet
//     router.push(href); // Navigate
//   };

//   return (
//     <div className="w-full flex items-center justify-between px-10 py-2 pl-2 pt-0">
//       <div onClick={() => router.push("/")}>
//         <Image
//           src={logo}
//           alt="Flow Logo"
//           className="w-[50px] h-auto cursor-pointer"
//         />
//       </div>
//       <div className="p-2 transition-all ease-in-out md:w-[30%] md:ml-20">
//         <Input
//           placeholder="🔍 Search here"
//           type="text"
//           className="rounded-[40px] transition-all ease-in-out placeholder:font-bold"
//         />
//       </div>
//       <div className="flex items-center gap-10 text-2xl">
//         <div className="not-md:hidden relative">
//           <Link href={"/cart"}>
//             <IoCartOutline className="text-white" />
//           </Link>
//           {cart && cart.length > 0 && (
//             <div className="absolute rounded-full bg-red-300 w-[18px] h-[18px] top-[-5px] right-[-10px] flex items-center justify-center text-black text-xs">
//               {cart.reduce((total, item) => total + item.quantity, 0)}
//             </div>
//           )}
//         </div>
//         <IoPersonSharp className="not-md:hidden text-white" />
//         <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
//           <SheetTrigger>
//             <GiHamburgerMenu className="text-white cursor-pointer" />
//           </SheetTrigger>
//           <SheetContent
//             side="right"
//             className="bg-inherit pt-6 md:pt-10 px-6 not-md:w-[40%]"
//           >
//             <p
//               className="w-full border-b pb-3 border-white text-center cursor-pointer"
//               onClick={() => handleNavigation("/about")}
//             >
//               About Us
//             </p>
//             <p
//               className="w-full border-b pb-3 border-white mt-4 text-center cursor-pointer"
//               onClick={() => handleNavigation("/shop")}
//             >
//               Shop
//             </p>
//             <p
//               className="w-full border-b pb-3 border-white mt-4 text-center cursor-pointer"
//               onClick={() => handleNavigation("/cart")}
//             >
//               Cart
//             </p>
//             <p
//               className="w-full border-b pb-3 border-white mt-4 text-center cursor-pointer"
//               onClick={() => handleNavigation("/about")}
//             >
//               Profile
//             </p>
//           </SheetContent>
//         </Sheet>
//       </div>
//     </div>
//   );
// };

// export default PageHeader;

"use client";

import logo from "@/../public/assets/images/Flow Logo.png";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useProductContext } from "@/contexts/ProductContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCartOutline, IoPersonSharp } from "react-icons/io5";

const PageHeader = () => {
  const router = useRouter();
  const { cart } = useProductContext();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only render Sheet component after client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = (href: string) => {
    setIsSheetOpen(false);
    router.push(href);
  };

  return (
    <div className="w-full flex items-center justify-between px-10 py-2 pl-2 pt-0">
      <div onClick={() => router.push("/")}>
        <Image
          src={logo}
          alt="Flow Logo"
          className="w-[50px] h-auto cursor-pointer"
        />
      </div>
      <div className="p-2 transition-all ease-in-out md:w-[30%] md:ml-20">
        <Input
          placeholder="🔍 Search here"
          type="text"
          className="rounded-[40px] transition-all ease-in-out placeholder:font-bold"
        />
      </div>
      <div className="flex items-center gap-10 text-2xl">
        <div className="not-md:hidden relative">
          <Link href={"/cart"}>
            <IoCartOutline className="text-white" />
          </Link>
          {cart && cart.length > 0 && (
            <div className="absolute rounded-full bg-red-300 w-[18px] h-[18px] top-[-5px] right-[-10px] flex items-center justify-center text-black text-xs">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </div>
          )}
        </div>
        <IoPersonSharp className="not-md:hidden text-white" />

        {/* Only render Sheet after component mounts on client */}
        {mounted ? (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger>
              <GiHamburgerMenu className="text-white cursor-pointer" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-inherit pt-6 md:pt-10 px-6 not-md:w-[40%]"
            >
              <p
                className="w-full border-b pb-3 border-white text-center cursor-pointer"
                onClick={() => handleNavigation("/about")}
              >
                About Us
              </p>
              <p
                className="w-full border-b pb-3 border-white mt-4 text-center cursor-pointer"
                onClick={() => handleNavigation("/shop")}
              >
                Shop
              </p>
              <p
                className="w-full border-b pb-3 border-white mt-4 text-center cursor-pointer"
                onClick={() => handleNavigation("/cart")}
              >
                Cart
              </p>
              <p
                className="w-full border-b pb-3 border-white mt-4 text-center cursor-pointer"
                onClick={() => handleNavigation("/about")}
              >
                Profile
              </p>
            </SheetContent>
          </Sheet>
        ) : (
          // Fallback while mounting - just show the hamburger icon
          <GiHamburgerMenu className="text-white cursor-pointer opacity-50" />
        )}
      </div>
    </div>
  );
};

export default PageHeader;
