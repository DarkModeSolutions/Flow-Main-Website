"use client";

import FlowButton from "@/components/FlowButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import useRegisterAsGuest from "@/hooks/useRegisterAsGuest";
import { Loader2Icon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CheckoutMethodModal = () => {
  const {
    error: registerError,
    loading: registerLoading,
    registerAsGuest,
  } = useRegisterAsGuest();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle guest form submission logic here
    console.log("Guest Form Data: ", formData);

    const res = await registerAsGuest(
      formData.email,
      formData.name,
      formData.phone
    );

    console.log(res);

    if (res && res.id) {
      console.log("Entering If block in Checkout Modal");
      // Successfully registered as guest, now sign in
      handleSignIn(formData.email, formData.phone);
    }
  };

  const handleSignIn = async (
    email: string,
    phone: string,
    signInType = "guest"
  ) => {
    try {
      const res = await signIn("credentials", {
        email,
        phone,
        signInType,
      });

      if (res?.error) {
        setError("Login as guest failed. Please try again.");
        setLoading(false);
        return;
      }

      router.refresh();
    } catch (error) {
      setError(`Login as guest failed. Please try again. ${error}`);
      setLoading(false);
    }
  };

  if (showGuestForm) {
    return (
      <div className="mt-4 p-4 border rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Guest Checkout</h3>
          <button
            onClick={() => setShowGuestForm(false)}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-4 mb-4">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-4 mb-4">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              type="tel"
              id="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
          <div>
            <Button
              size="sm"
              disabled={loading || registerLoading}
              type="submit"
            >
              {loading || registerLoading ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Please wait
                </>
              ) : (
                "Continue as Guest"
              )}
            </Button>
            {error || (registerError && <div>{error || registerError}</div>)}
          </div>
        </form>
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
        redirectTo="/auth/login?redirect=/cart"
        className="w-full rounded-[12px] bg-white"
      >
        Buy as User
      </FlowButton>
    </div>
  );
};

export default CheckoutMethodModal;
