"use client";

import FlowButton from "@/components/FlowButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    address: {
      addressLine1: "",
      addressLine2: "",
      pincode: "",
      city: "",
      state: "",
      country: "",
    },
    age: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await registerAsGuest(
      formData.email,
      formData.name,
      formData.phone,
      formData.address,
      formData.age
    );

    if (res && res.id) {
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
      <ScrollArea className="h-72 rounded-md border">
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
              <Label htmlFor="email">
                Email <span className="text-red-600">*</span>
              </Label>
              <Input
                required
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
              <Label htmlFor="name">
                Name <span className="text-red-600">*</span>
              </Label>
              <Input
                required
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
              <Label htmlFor="phone">
                Phone Number <span className="text-red-600">*</span>
              </Label>
              <Input
                required
                type="tel"
                id="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-4 mb-4">
              <Label>
                Address <span className="text-red-600">*</span>
              </Label>
              <Input
                required
                type="text"
                id="address1"
                name="address1"
                placeholder="Address Line 1"
                value={formData.address.addressLine1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      addressLine1: e.target.value,
                    },
                  })
                }
              />
              <Input
                type="text"
                id="address2"
                name="address2"
                placeholder="Address Line 2"
                value={formData.address.addressLine2}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      addressLine2: e.target.value,
                    },
                  })
                }
              />
              <Input
                required
                type="text"
                id="city"
                name="city"
                placeholder="City"
                value={formData.address.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value },
                  })
                }
              />
              <Input
                required
                type="text"
                id="pincode"
                name="pincode"
                placeholder="Pincode"
                value={formData.address.pincode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, pincode: e.target.value },
                  })
                }
              />
              <Input
                required
                type="text"
                id="state"
                name="state"
                placeholder="State"
                value={formData.address.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, state: e.target.value },
                  })
                }
              />
              <Input
                required
                type="text"
                id="country"
                name="country"
                placeholder="Country"
                value={formData.address.country}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, country: e.target.value },
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-4 mb-4">
              <Label htmlFor="age">Age</Label>
              <Input
                type="number"
                id="age"
                name="age"
                placeholder="Age"
                value={formData.age <= 0 ? "" : formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: Number(e.target.value) })
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
      </ScrollArea>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <FlowButton
        onClickHandler={() => setShowGuestForm(true)}
        className="w-full rounded-xl bg-white"
      >
        Buy as Guest
      </FlowButton>

      <Separator className="my-4 w-[70%]! mx-auto" />

      <FlowButton
        redirectTo="/auth/login?redirect=/cart"
        className="w-full rounded-xl bg-white"
      >
        Buy as User
      </FlowButton>
    </div>
  );
};

export default CheckoutMethodModal;
