"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const TrackOrderPage = () => {
  const [inputOrderId, setInputOrderId] = useState("");
  const router = useRouter();

  const handleTrackOrder = () => {
    if (inputOrderId.trim()) {
      router.push(`/orders/track/${inputOrderId}`);
    }
  };

  return (
    <div>
      <h1 className="manrope manrope-semibold text-[#24BFCF] text-2xl">
        Track Your Order
      </h1>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Enter Order ID"
          value={inputOrderId}
          onChange={(e) => setInputOrderId(e.target.value)}
          className="border p-2"
        />
        <button
          onClick={handleTrackOrder}
          className="ml-2 bg-[#24BFCF] text-black p-2"
        >
          Track
        </button>
      </div>
    </div>
  );
};

export default TrackOrderPage;
