"use client";

import { Spinner } from "@/components/ui/spinner";
import useUpdatePurchaseOrder from "@/hooks/useUpdatePurchaseOrder";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { success, error, loading, updatePurchaseOrder } =
    useUpdatePurchaseOrder();

  useEffect(() => {
    async function updateOrderStatus() {
      if (orderId) {
        const data = await updatePurchaseOrder(orderId);

        if (data?.orderFullfillmentStatus === "PENDING") {
          console.error("Order is still pending:", data?.message);
        } else if (data?.orderFullfillmentStatus === "COMPLETED") {
          console.log("Order completed successfully.");
        }
      }
    }

    updateOrderStatus();
  }, [orderId, updatePurchaseOrder]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <h1 className="text-3xl font-semibold text-green-600 mb-4">
        Payment Successful 🎉
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
