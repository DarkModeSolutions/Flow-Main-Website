import { Cart, RequestType } from "@/types/types";
import getRequestData from "@/utils/getRequestData";
import handleResponseNotOk from "@/utils/handleResponseNotOk";
import { useCallback, useState } from "react";

const useInitiatePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = useCallback(
    async ({
      cart,
      amount,
      description,
      userId,
    }: {
      cart: Cart[] | [];
      amount: number;
      description: string;
      userId: string | undefined;
    }) => {
      try {
        setLoading(true);
        setError(null);

        const requestData: RequestType = {
          url: "/api/zoho/payment-session",
          method: "POST",
          body: { cart, amount, description, userId },
        };

        const response = await getRequestData({ requestData });

        if (!response.ok) {
          handleResponseNotOk(response, "Error initiating payment");
          throw new Error("Error initiating payment");
        }

        const data = await response.json();

        if (data.success && data.checkout_url && data.orderId) {
          const existingOrderId = localStorage.getItem("orderId");
          if (existingOrderId) {
            localStorage.removeItem("orderId");
          }
          localStorage.setItem("orderId", data.orderId);
        } else {
          throw new Error(data.error || "Failed to start payment");
        }

        return data.checkout_url as string;
      } catch (error) {
        console.log("Error while paying:", error);
        setError("Network error occurred while paying");
        return { success: false, error: "Network error occurred" };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { initiatePayment, loading, error };
};

export default useInitiatePayment;
