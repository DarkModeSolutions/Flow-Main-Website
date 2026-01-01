"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useProductContext } from "@/contexts/ProductContext";
import { bundleImages } from "@/utils/constants";
import { BundleCartItem } from "@/types/types";
import { Button } from "@/components/ui/button";

interface BundleOption {
  size: number;
  label: string;
  pricePerPack: number;
  originalPrice: number;
  discount: string;
  tag?: string;
  tagColor?: string;
}

const bundleOptions: BundleOption[] = [
  {
    size: 1,
    label: "Pack of 1",
    pricePerPack: 550,
    originalPrice: 600,
    discount: "8% Off",
    tag: "Get 8% Off",
    tagColor: "bg-[#BFFF00] text-black",
  },
  {
    size: 2,
    label: "Pack of 2",
    pricePerPack: 500,
    originalPrice: 600,
    discount: "17% Off",
    tag: "MOST POPULAR",
    tagColor: "bg-[#BFFF00] text-black",
  },
  {
    size: 3,
    label: "Pack of 3",
    pricePerPack: 450,
    originalPrice: 600,
    discount: "25% Off",
    tag: "MOST SAVINGS",
    tagColor: "bg-black text-[#BFFF00] border border-[#BFFF00]",
  },
];

const BundleAndSave: React.FC = () => {
  const { products, addBundleToCart } = useProductContext();
  const [selectedBundle, setSelectedBundle] = useState<number>(1);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // Get available flavors from products
  const availableFlavors = useMemo(() => {
    if (!products) return [];
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
    }));
  }, [products]);

  // Initialize selected flavors when bundle size changes
  React.useEffect(() => {
    if (availableFlavors.length > 0) {
      const defaultFlavor = availableFlavors[0]?.id || "";
      setSelectedFlavors(Array(selectedBundle).fill(defaultFlavor));
    }
  }, [selectedBundle, availableFlavors]);

  const currentOption = bundleOptions.find((opt) => opt.size === selectedBundle);

  const handleFlavorChange = (index: number, flavorId: string) => {
    setSelectedFlavors((prev) => {
      const newFlavors = [...prev];
      newFlavors[index] = flavorId;
      return newFlavors;
    });
  };

  const handleAddToCart = () => {
    if (!currentOption || selectedFlavors.length !== selectedBundle) return;

    setIsAdding(true);

    const bundleItem: BundleCartItem = {
      bundleId: `bundle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      bundleSize: selectedBundle,
      pricePerPack: currentOption.pricePerPack,
      originalPricePerPack: currentOption.originalPrice,
      totalPrice: currentOption.pricePerPack * selectedBundle,
      flavors: selectedFlavors,
    };

    addBundleToCart(bundleItem);

    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const getFlavorName = (productId: string) => {
    return availableFlavors.find((f) => f.id === productId)?.name || "Unknown";
  };

  const getFlavorImage = (productId: string) => {
    const flavor = availableFlavors.find((f) => f.id === productId);
    if (flavor?.imageUrl && bundleImages[flavor.imageUrl as keyof typeof bundleImages]) {
      return bundleImages[flavor.imageUrl as keyof typeof bundleImages];
    }
    return null;
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="w-full mt-8 md:mt-12 px-2 sm:px-0">
      {/* Section Header */}
      <div className="flex items-center justify-center mb-4 md:mb-6">
        <div className="flex-1 h-px bg-gray-700"></div>
        <h2 className="px-3 md:px-4 text-base md:text-xl font-semibold tracking-wide text-white uppercase text-center">
          Bundle &amp; Save
        </h2>
        <div className="flex-1 h-px bg-gray-700"></div>
      </div>

      <p className="text-center text-gray-400 text-xs md:text-sm mb-4 md:mb-6">Buy more, get more</p>

      {/* Bundle Options */}
      <div className="space-y-4">
        {bundleOptions.map((option) => {
          const isSelected = selectedBundle === option.size;
          const totalPrice = option.pricePerPack * option.size;
          const originalTotal = option.originalPrice * option.size;

          return (
            <div
              key={option.size}
              onClick={() => setSelectedBundle(option.size)}
              className={`relative border-2 rounded-xl p-3 md:p-4 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-[#BFFF00] bg-[#BFFF00]/10"
                  : "border-gray-700 bg-gray-900/50 hover:border-gray-500"
              }`}
            >
              {/* Tag badge */}
              {option.tag && (
                <div
                  className={`absolute -top-2.5 md:-top-3 right-2 md:right-4 px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-sm transform -rotate-2 ${option.tagColor}`}
                >
                  {option.tag}
                </div>
              )}

              <div className="flex items-center gap-2 md:gap-4">
                {/* Radio button */}
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? "border-[#BFFF00]" : "border-gray-500"
                  }`}
                >
                  {isSelected && (
                    <div className="w-3 h-3 rounded-full bg-[#BFFF00]"></div>
                  )}
                </div>

                {/* Product images stack */}
                <div className="relative w-10 h-12 md:w-16 md:h-16 shrink-0">
                  {Array.from({ length: option.size }).map((_, idx) => (
                    <div
                      key={idx}
                      className="absolute w-8 h-12 md:w-12 md:h-16"
                      style={{
                        left: `${idx * 6}px`,
                        zIndex: option.size - idx,
                      }}
                    >
                      {isSelected && selectedFlavors[idx] ? (
                        getFlavorImage(selectedFlavors[idx]) ? (
                          <Image
                            src={getFlavorImage(selectedFlavors[idx])!}
                            alt={getFlavorName(selectedFlavors[idx])}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-b from-[#24BFCF] to-[#1a8a96] rounded-md"></div>
                        )
                      ) : (
                        <div className="w-full h-full bg-gradient-to-b from-[#24BFCF] to-[#1a8a96] rounded-md"></div>
                      )}
                    </div>
                  ))}
                  {/* Quantity badge */}
                  <div className="absolute -bottom-1 -left-1 bg-black text-white text-[10px] md:text-xs font-bold px-1 md:px-1.5 py-0.5 rounded z-20">
                    x{option.size}
                  </div>
                </div>

                {/* Bundle info */}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                    <span className="font-semibold text-white text-sm md:text-base">{option.label}</span>
                    {option.size > 1 && (
                      <span className="text-[10px] md:text-xs bg-gray-800 text-gray-300 px-1.5 md:px-2 py-0.5 rounded">
                        -{option.discount}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] md:text-sm text-gray-400 truncate">
                    Save {option.discount} on {option.size * 10} sachets
                  </p>
                </div>

                {/* Price */}
                <div className="text-right shrink-0 ml-1">
                  <p className="text-sm md:text-lg font-bold text-white">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] md:text-sm text-gray-500 line-through">
                    ₹{originalTotal.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Flavor selection - shown only when selected and size > 1 */}
              {isSelected && option.size >= 1 && (
                <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-700">
                  <p className="text-xs md:text-sm text-gray-400 mb-2 md:mb-3">Select your flavors:</p>
                  <div className="space-y-2">
                    {Array.from({ length: option.size }).map((_, idx) => (
                      <div key={idx} className="flex items-center gap-2 md:gap-3">
                        <span className="text-xs md:text-sm text-gray-500 w-5 md:w-6">#{idx + 1}</span>
                        <select
                          value={selectedFlavors[idx] || ""}
                          onChange={(e) => handleFlavorChange(idx, e.target.value)}
                          className="flex-1 bg-gray-800 border border-gray-600 text-white text-sm md:text-base rounded-lg px-2 md:px-3 py-1.5 md:py-2 focus:outline-none focus:ring-2 focus:ring-[#BFFF00] focus:border-transparent"
                        >
                          <option value="" disabled>
                            Select flavor
                          </option>
                          {availableFlavors.map((flavor) => (
                            <option
                              key={flavor.id}
                              value={flavor.id}
                              className="bg-gray-800 text-white"
                            >
                              {flavor.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add to Cart Button */}
      <div className="mt-4 md:mt-6 space-y-3">
        <Button
          onClick={handleAddToCart}
          disabled={isAdding || selectedFlavors.length !== selectedBundle}
          className="w-full py-4 md:py-6 text-base md:text-lg font-semibold bg-white text-black border-2 border-black hover:bg-gray-100 rounded-full transition-all"
        >
          {isAdding ? "Adding..." : "ADD TO CART"}
        </Button>
      </div>
    </div>
  );
};

export default BundleAndSave;
