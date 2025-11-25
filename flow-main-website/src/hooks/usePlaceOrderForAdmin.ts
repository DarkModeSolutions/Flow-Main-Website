"use client";

import { RequestType } from "@/types/types";
import getRequestData from "@/utils/getRequestData";
import handleHookCatch from "@/utils/handleHookCatch";
import handleResponseNotOk from "@/utils/handleResponseNotOk";
import { useCallback, useState } from "react";

const usePlaceOrderForAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placeOrderForAdmin = useCallback(
    async (
      orderId: string,
      pickupAddressId: number,
      acceptOrderRequest: boolean
    ) => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors

        const requestData: RequestType = {
          url: `/api/admin/delivery/placeOrder`,
          method: "POST",
          body: { orderId, pickupAddressId, acceptOrderRequest },
        };

        const response = await getRequestData({ requestData });

        if (!response.ok) {
          handleResponseNotOk(response, "Error in placing order for admin");
        }

        const data = await response.json();

        return data;
      } catch (error) {
        handleHookCatch(error, setError, "Failed to place order");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { placeOrderForAdmin, loading, error };
};

export default usePlaceOrderForAdmin;
