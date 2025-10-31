"use client";

import logo from "@/../public/assets/images/Flow Logo.png";
import SearchResult from "@/components/SearchResult";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useProductContext } from "@/contexts/ProductContext";
import { useUserContext } from "@/contexts/UserContext";
import useUserSignOut from "@/hooks/useUserSignOut";
import { AllProductDetails } from "@/types/types";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCartOutline, IoPersonSharp } from "react-icons/io5";

const PageHeader = () => {
  const router = useRouter();

  const { cart, products } = useProductContext();
  const { user } = useUserContext();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchResult, setSearchResult] = useState<
    AllProductDetails[] | undefined
  >(undefined);

  const findHandler = (searchString: string) => {
    console.log("Search string: ", searchString);
    let results: AllProductDetails[] | undefined = undefined;
    if (searchString.length <= 2) {
      results = [];
    } else {
      const lowerCaseSearchString = searchString.toLowerCase();
      const searchResults = products?.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseSearchString) ||
          product.searchTags.some((tag) =>
            tag.toLowerCase().includes(lowerCaseSearchString)
          )
      );
      console.log("Search Results: ", searchResults);
      results = searchResults;
    }
    setSearchResult(results);
  };

  const { userSignOut } = useUserSignOut();

  const handleSignOut = async () => {
    await userSignOut();
    signOut({ callbackUrl: "/" });
  };

  // Only render Sheet component after client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  console.log("This is header");

  const handleNavigation = (href: string) => {
    setIsSheetOpen(false);
    router.push(href);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full h-6 bg-[#19b6e6] text-black">
        <Marquee className="text-black" gradient={false} speed={50}>
          <span className="text-black">
            Some text to scroll across the top of the page - Welcome to Flow!
            Enjoy
          </span>
        </Marquee>
      </div>
      <div className="w-full flex items-center justify-between px-10 py-2 pl-2 pt-0">
        <div onClick={() => router.push("/")}>
          <Image
            src={logo}
            alt="Flow Logo"
            className="w-[50px] h-auto cursor-pointer"
          />
        </div>
        <div className="relative p-2 transition-all ease-in-out md:w-[30%] md:ml-20">
          <Input
            placeholder="🔍 Search here"
            type="text"
            className="rounded-[40px] transition-all ease-in-out placeholder:font-bold"
            onChange={(e) => findHandler(e.target.value)}
          />
          {searchResult && searchResult?.length > 0 && (
            <div className="w-full min-h-0 absolute top-[110%] left-0 rounded-md shadow-md max-h-60 overflow-y-auto bg-black/15 backdrop-blur-md p-4">
              {searchResult?.map((result) => (
                <SearchResult
                  id={result.id}
                  img={result.imageUrl}
                  name={result.name}
                  key={result.id}
                />
              ))}
            </div>
          )}
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
          {user && user.email && !user.buyingAsGuest && (
            <Link href={"/profile"}>
              <IoPersonSharp className="not-md:hidden text-[#24bfcf]" />
            </Link>
          )}

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
                {user && user.email && !user.buyingAsGuest && (
                  <p
                    className="w-full border-b pb-3 border-white mt-4 text-center cursor-pointer"
                    onClick={() => handleNavigation("/profile")}
                  >
                    Profile
                  </p>
                )}
                <p
                  className="w-full border-b pb-3 border-white mt-4 text-center cursor-pointer"
                  onClick={() => handleNavigation("/know-your-ingredients")}
                >
                  Know your Ingredients
                </p>
                {user && user.email && !user.buyingAsGuest ? (
                  <p
                    className="w-full border-b pb-3 border-white mt-4 text-center cursor-pointer"
                    onClick={() => handleSignOut()}
                  >
                    Sign Out
                  </p>
                ) : (
                  <p
                    className="w-full border-b pb-3 border-white mt-4 text-center cursor-pointer"
                    onClick={() => handleNavigation("/auth/login")}
                  >
                    Sign In
                  </p>
                )}
              </SheetContent>
            </Sheet>
          ) : (
            // Fallback while mounting - just show the hamburger icon
            <GiHamburgerMenu className="text-white cursor-pointer opacity-50" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
