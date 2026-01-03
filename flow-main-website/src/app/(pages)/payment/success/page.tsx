"use client";

import { Spinner } from "@/components/ui/spinner";
import { useProductContext } from "@/contexts/ProductContext";
import useUpdatePurchaseOrder from "@/hooks/useUpdatePurchaseOrder";
import useUserSignOut from "@/hooks/useUserSignOut";
import { getSessionUserClient } from "@/utils/getUserDetailsClient";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const paymentLink = searchParams.get("payment_link_id");
  // console.log("This is orderId in PaymentSuccess page: ", orderId);

  const { clearCart } = useProductContext();

  const { success, error, loading, updatePurchaseOrder } =
    useUpdatePurchaseOrder();

  const { userSignOut } = useUserSignOut();

  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!orderId) {
      // console.log("No order ID right now");
      redirect("/");
    } // wait until it's available

    if (hasRunRef.current) return; // 🚫 stop repeat calls
    hasRunRef.current = true;

    async function updateOrderStatus() {
      if (
        typeof orderId === "string" &&
        orderId.length > 0 &&
        orderId !== null
      ) {
        const data = await updatePurchaseOrder(
          orderId || undefined,
          paymentLink || undefined
        );

        if (data?.orderFullfillmentStatus === "PENDING") {
          console.error("Order is still pending:", data?.message);
        } else if (data?.orderFullfillmentStatus === "COMPLETED") {
          console.log("Order completed successfully.");
        }

        console.log("Order Completed with or without failure");

        const userDetails = await getSessionUserClient();

        console.log("User Signed out");

        if (userDetails && userDetails.buyingAsGuest) {
          await userSignOut();
          signOut({ redirect: false });
        }

        clearCart();

        localStorage.removeItem("cart");
        localStorage.removeItem("orderId");
      }
    }

    updateOrderStatus();
  }, [orderId, updatePurchaseOrder, paymentLink, clearCart, userSignOut]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <h1 className="text-3xl font-semibold text-green-600 mb-4">
        Payment Successful 🎉
        <br />
        Please check the below message
      </h1>
      <p className="text-gray-700">{`${
        error || success
      }: Please contact our support team. Email Id at the footer of the page. `}</p>
      <Link
        href="/"
        className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<Spinner />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
