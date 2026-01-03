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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCartOutline, IoPersonSharp } from "react-icons/io5";
import { MdOutlineClear } from "react-icons/md";

type NavigationItem = {
  label: string;
  href: string;
  action?: () => void | Promise<void>;
};

const PageHeader = () => {
  const router = useRouter();

  const { cart, products } = useProductContext();
  const { user } = useUserContext();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchResult, setSearchResult] = useState<
    AllProductDetails[] | undefined
  >(undefined);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showSignOutToast, setShowSignOutToast] = useState(false);
  const [showSignInHint, setShowSignInHint] = useState(false);

  const clearInputHandler = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      setSearchInputValue("");
      setSearchResult([]);
    }
  };

  const findHandler = useCallback(
    (searchString: string) => {
      if (searchString.length <= 2) {
        setSearchResult([]);
        return;
      }
      const lowerCaseSearchString = searchString.toLowerCase();
      const searchResults = products?.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseSearchString) ||
          product.searchTags.some((tag) =>
            tag.toLowerCase().includes(lowerCaseSearchString)
          )
      );
      setSearchResult(searchResults);
    },
    [products]
  );

  const { userSignOut } = useUserSignOut();

  const cartItemCount = useMemo(
    () => cart?.reduce((total, item) => total + item.quantity, 0) ?? 0,
    [cart]
  );

  const handleSignOut = useCallback(async () => {
    await userSignOut();
    setShowSignOutToast(true);
    setTimeout(() => {
      setShowSignOutToast(false);
    }, 3000);
    signOut({ callbackUrl: "/" });
  }, [userSignOut]);

  // Only render Sheet component after client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show sign-in hint for non-authenticated users after a delay
  useEffect(() => {
    if (mounted && (!user || !user.email || user.buyingAsGuest)) {
      // Check if user has seen the hint before
      const hasSeenHint = localStorage.getItem("hasSeenSignInHint");
      if (!hasSeenHint) {
        const timer = setTimeout(() => {
          setShowSignInHint(true);
          // Auto-hide after 5 seconds
          setTimeout(() => {
            setShowSignInHint(false);
            localStorage.setItem("hasSeenSignInHint", "true");
          }, 5000);
        }, 2000); // Show after 2 seconds of page load
        return () => clearTimeout(timer);
      }
    }
  }, [mounted, user]);

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

  const _isAuthenticated = Boolean(user && user.email && !user.buyingAsGuest);

  const navigationItems = useMemo<NavigationItem[]>(() => {
    const items: NavigationItem[] = [
      { label: "Home", href: "/" },
      { label: "Products", href: "/shop" },
      { label: "Cart", href: "/cart" },
      { label: "About Us", href: "/about" },
    ];

    // Profile and Sign Out are now in the profile dropdown, not in main nav

    return items;
  }, []);

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
      <div className="w-full relative flex flex-wrap items-center gap-1 md:gap-4 px-2 md:px-10 py-0 md:py-2">
        <div className="flex items-center shrink-0 order-1">
          <div onClick={() => router.push("/")} className="cursor-pointer">
            <Image
              src={logo}
              alt="Flow Logo"
              className="w-[35px] md:w-[50px] h-auto"
            />
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm uppercase tracking-[0.2em] text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {navigationItems.map((item) => {
            const isAction = Boolean(item.action);
            const isActive =
              !isAction &&
              item.href !== "#sign-out" &&
              (item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href));
            const baseClasses =
              "pb-1 border-b-2 border-transparent hover:border-white transition-colors cursor-pointer text-white";

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
        <div className="flex items-center gap-4 md:gap-6 ml-auto text-2xl md:flex-none justify-end order-2">
          <div className="relative flex items-center gap-2 group max-md:hidden">
            <CiSearch className="text-white text-lg shrink-0" />
            <div className="flex flex-col relative">
              <Input
                ref={inputRef}
                placeholder={displayedText}
                type="text"
                className="border-0 bg-transparent text-white placeholder:text-white/50 placeholder:text-xs focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-all ease-in-out w-32 md:w-40 pr-7"
                onChange={(e) => findHandler(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onInput={() => {
                  const value = inputRef.current?.value ?? "";
                  setSearchInputValue(value);
                }}
              />
              <div className="h-px bg-white/30 group-hover:bg-white group-focus-within:bg-white transition-all ease-in-out"></div>
              {searchInputValue.length > 0 ? (
                <div
                  onClick={clearInputHandler}
                  className="absolute right-0 top-1 cursor-pointer p-1 hover:bg-gray-500 transition-all ease-in-out duration-300 rounded-full"
                >
                  <MdOutlineClear className="size-5" />
                </div>
              ) : null}
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

          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative">
              <Link href={"/cart"}>
                <IoCartOutline className="text-white" />
              </Link>
              {cartItemCount > 0 && (
                <div className="absolute rounded-full bg-red-300 w-[18px] h-[18px] top-[-5px] -right-2.5 flex items-center justify-center text-black text-xs">
                  {cartItemCount}
                </div>
              )}
            </div>

            {user && user.email && !user.buyingAsGuest ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="focus:outline-none"
                >
                  <IoPersonSharp className="text-[#24bfcf] cursor-pointer" />
                </button>
                {isProfileDropdownOpen && (
                  <>
                    {/* Backdrop to close dropdown when clicking outside */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    />
                    {/* Dropdown menu */}
                    <div className="absolute right-0 top-full mt-2 w-40 bg-black/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="block px-4 py-3 text-sm text-white hover:bg-[#24bfcf]/20 transition-colors border-b border-gray-700"
                      >
                        Profile
                      </Link>
                      <button
                        type="button"
                        onClick={async () => {
                          setIsProfileDropdownOpen(false);
                          await handleSignOut();
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-white hover:bg-red-500/20 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="relative">
                <Link
                  href={"/auth/login"}
                  onClick={() => setShowSignInHint(false)}
                >
                  <IoPersonSharp className="text-white" />
                </Link>
                {/* Sign-in hint indicator */}
                {showSignInHint && (
                  <div className="absolute right-0 top-full mt-2 z-50 animate-fade-in-bounce">
                    {/* Arrow pointing up */}
                    <div className="flex flex-col items-end">
                      <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-8 border-b-[#24bfcf] mr-2 animate-bounce" />
                      <div className="bg-[#24bfcf]/90 backdrop-blur-sm text-black text-[10px] md:text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap font-medium">
                        Click here to sign in ✨
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

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

        {/* Mobile search bar - centered below logo */}
        <div className="w-full md:hidden order-3 flex justify-center mt-0 px-1">
          <div className="relative flex items-center gap-0.5 group w-full max-w-xs mx-auto">
            <CiSearch className="text-white text-xs shrink-0" />
            <div className="flex flex-col flex-1">
              <Input
                placeholder={displayedText}
                type="text"
                className="border-0 bg-transparent text-white placeholder:text-white/50 placeholder:text-[10px] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-all ease-in-out w-full text-center h-5 py-0 text-xs"
                onChange={(e) => findHandler(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <div className="h-px bg-white/30 group-hover:bg-white group-focus-within:bg-white transition-all ease-in-out"></div>
            </div>
            {searchResult && searchResult?.length > 0 && (
              <div className="w-full min-h-0 absolute top-[110%] left-0 rounded-md shadow-md max-h-60 overflow-y-auto bg-black/15 backdrop-blur-md p-4 z-50">
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
        </div>
      </div>

      {/* Sign Out Success Toast */}
      {showSignOutToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-100 animate-slide-up-fade-in">
          <div className="bg-green-500/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium text-sm">Signed Out Successfully</span>
          </div>
        </div>
      )}

      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes fade-in-bounce {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          50% {
            opacity: 1;
            transform: translateY(2px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up-fade-in {
          0% {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        :global(.animate-fade-in-bounce) {
          animation: fade-in-bounce 0.4s ease-out forwards;
        }
        :global(.animate-slide-up-fade-in) {
          animation: slide-up-fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PageHeader;
