"use client";

import FlowButton from "@/components/FlowButton";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
// import { useRouter } from "next/navigation";

const CheckoutMethodModal = () => {
  // const router = useRouter();
  const [showGuestForm, setShowGuestForm] = useState(false);

  if (showGuestForm) {
    return (
      <div className="mt-4 p-4 border rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Guest Checkout</h3>
          <button
            onClick={() => setShowGuestForm(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Continue without creating an account
        </p>
        <FlowButton
          // onClickHandler={() => router.push("/checkout/guest")}
          redirectTo="/checkout/guest"
          className="w-full rounded-[12px] bg-white"
        >
          Continue as Guest
        </FlowButton>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <FlowButton
        onClickHandler={() => setShowGuestForm(true)}
        className="w-full rounded-[12px] bg-white"
      >
        Buy as Guest
      </FlowButton>

      <Separator className="my-4 !w-[70%] mx-auto" />

      <FlowButton
        // onClickHandler={() => router.push("/auth/login?redirect=/cart")}
        redirectTo="/auth/login?redirect=/cart"
        className="w-full rounded-[12px] bg-white"
      >
        Buy as User
      </FlowButton>
    </div>
  );
};

export default CheckoutMethodModal;
