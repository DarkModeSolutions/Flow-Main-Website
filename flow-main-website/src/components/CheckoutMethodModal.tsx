"use client";

import FlowButton from "@/components/FlowButton";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

const CheckoutMethodModal = () => {
  const router = useRouter();

  return (
    <div className="mt-4">
      <FlowButton className="rounded-[12px] bg-white">Buy as Guest</FlowButton>
      <Separator className="my-4 !w-[70%] mx-auto" />
      <FlowButton
        onClickHandler={() => router.push("/auth/login?redirect=/cart")}
        className="rounded-[12px] bg-white"
      >
        Buy as User
      </FlowButton>
    </div>
  );
};

export default CheckoutMethodModal;
