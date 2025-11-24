"use client";

import ErrorComponent from "@/components/ErrorComponent";
import LoadingComponent from "@/components/LoadingComponent";
import useGetDeliveryOrderDetails from "@/hooks/useGetDeliveryOrderDetails";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const TrackOrderDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const { error, getDeliveryOrderDetails, loading } =
    useGetDeliveryOrderDetails();

  useEffect(() => {
    if (!orderId) {
      console.error("Order ID is missing in the URL parameters.");
      router.push("/orders/track");
    } else {
      getDeliverDetails();
    }

    async function getDeliverDetails() {
      try {
        const deliveryData = await getDeliveryOrderDetails(orderId);
        console.log("Delivery Data: ", deliveryData);
      } catch (error) {
        return <ErrorComponent error={error} />;
      }
    }
  }, [getDeliveryOrderDetails, orderId, router]);

  if (error !== null) {
    return <ErrorComponent error={error} />;
  }

  return (
    <div>
      <h1 className="manrope manrope-semibold text-[#24BFCF] text-2xl">
        Track your Order here!
      </h1>
      {loading ? (
        <LoadingComponent />
      ) : (
        <p className="text-gray-600 mt-4">
          Your order is being processed. Detailed tracking information will be
          available soon.
        </p>
      )}
    </div>
  );
};

export default TrackOrderDetailsPage;
