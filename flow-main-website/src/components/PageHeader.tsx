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
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Marquee from "react-fast-marquee";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCartOutline, IoPersonSharp } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";

type NavigationItem = {
  label: string;
  href: string;
  action?: () => void | Promise<void>;
};

const PageHeader = () => {
  const router = useRouter();

  const { cart, products } = useProductContext();
  const { user } = useUserContext();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchResult, setSearchResult] = useState<
    AllProductDetails[] | undefined
  >(undefined);
  const [isFocused, setIsFocused] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

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

  const handleSignOut = useCallback(async () => {
    await userSignOut();
    signOut({ callbackUrl: "/" });
  }, [userSignOut]);

  // Only render Sheet component after client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Typing animation effect - slower (5 seconds cycle)
  useEffect(() => {
    if (!isFocused) {
      const fullText = "Search Here";
      let currentIndex = 0;
      let isTyping = true;

      const interval = setInterval(() => {
        if (isTyping) {
          setDisplayedText(fullText.slice(0, currentIndex));
          currentIndex++;
          
          if (currentIndex > fullText.length) {
            isTyping = false;
            setTimeout(() => {
              currentIndex = 0;
              isTyping = true;
            }, 2000); // Pause for 2 seconds when fully typed
          }
        }
      }, 200); // Slower typing speed

      return () => clearInterval(interval);
    } else {
      setDisplayedText("");
    }
  }, [isFocused]);

  console.log("This is header");

  const pathname = usePathname();

  const isAuthenticated = Boolean(
    user && user.email && !user.buyingAsGuest
  );

  const navigationItems = useMemo<NavigationItem[]>(
    () => {
      const items: NavigationItem[] = [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about" },
        { label: "Shop", href: "/shop" },
        { label: "Cart", href: "/cart" },
      ];

      if (isAuthenticated) {
        items.push({ label: "Profile", href: "/profile" });
      }

      items.push({ label: "Know your Ingredients", href: "/know-your-ingredients" });

      items.push(
        isAuthenticated
          ? { label: "Sign Out", href: "#sign-out", action: handleSignOut }
          : { label: "Sign In", href: "/auth/login" }
      );

      return items;
    },
    [handleSignOut, isAuthenticated]
  );

  const handleNavigation = (href: string) => {
    setIsSheetOpen(false);
    router.push(href);
  };

  return (
    <div className="w-full flex flex-col">
      {/* <div className="w-full h-6 bg-[#19b6e6] text-black">
        <Marquee className="text-black" gradient={false} speed={50}>
          <span className="text-black">
            Some text to scroll across the top of the page - Welcome to Flow!
            Enjoy
          </span>
        </Marquee>
      </div> */}
      <div className="w-full relative flex items-center gap-4 px-4 md:px-10 py-2">
        <div className="flex items-center flex-shrink-0">
          <div onClick={() => router.push("/")} className="cursor-pointer">
            <Image
              src={logo}
              alt="Flow Logo"
              className="w-[50px] h-auto"
            />
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm uppercase tracking-[0.2em] text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {navigationItems.map((item) => {
            const isAction = Boolean(item.action);
            const isActive = !isAction && item.href !== "#sign-out" && (
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
            );
            const baseClasses = "pb-1 border-b-2 border-transparent hover:border-white transition-colors cursor-pointer text-white";

            if (isAction) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={async () => {
                    await item.action?.();
                  }}
                  className={baseClasses}
                >
                  {item.label}
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${baseClasses} ${isActive ? "border-white" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
  <div className="flex items-center gap-6 ml-auto text-2xl md:flex-none justify-end">
          <div className="relative flex items-center gap-2 group">
            <CiSearch className="text-white text-lg flex-shrink-0" />
            <div className="flex flex-col">
              <Input
                placeholder={displayedText}
                type="text"
                className="border-0 bg-transparent text-white placeholder:text-white/50 placeholder:text-xs focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-all ease-in-out w-32 md:w-40"
                onChange={(e) => findHandler(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <div className="h-[1px] bg-white/30 group-hover:bg-white group-focus-within:bg-white transition-all ease-in-out"></div>
            </div>
            {searchResult && searchResult?.length > 0 && (
              <div className="w-full min-h-0 absolute top-[110%] -left-2 rounded-md shadow-md max-h-60 overflow-y-auto bg-black/15 backdrop-blur-md p-4 z-50">
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
              <SheetTrigger className="md:hidden">
                <GiHamburgerMenu className="text-white cursor-pointer" />
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-inherit pt-6 md:pt-10 px-6 not-md:w-[40%]"
              >
                {navigationItems.map((item, index) => {
                  const isAction = Boolean(item.action);
                  const spacingClass = index === 0 ? "" : " mt-4";
                  return isAction ? (
                    <button
                      key={item.label}
                      type="button"
                      className={`w-full border-b pb-3 border-white text-center text-white${spacingClass}`}
                      onClick={async () => {
                        await item.action?.();
                        setIsSheetOpen(false);
                      }}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <p
                      key={item.href}
                      className={`w-full border-b pb-3 border-white text-center cursor-pointer${spacingClass}`}
                      onClick={() => handleNavigation(item.href)}
                    >
                      {item.label}
                    </p>
                  );
                })}
              </SheetContent>
            </Sheet>
          ) : (
            <GiHamburgerMenu className="text-white cursor-pointer opacity-50 md:hidden" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
