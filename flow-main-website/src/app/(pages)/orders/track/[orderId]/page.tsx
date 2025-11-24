"use client";

import { useParams } from "next/navigation";

const TrackOrderDetailsPage = () => {
  const params = useParams();
  const orderId = params.orderId as string;

  return (
    <div>
      <h1 className="manrope manrope-semibold text-[#24BFCF] text-2xl">
        Track your Order here!
      </h1>
      <div>Order ID: {orderId}</div>
    </div>
  );
};

export default TrackOrderDetailsPage;
