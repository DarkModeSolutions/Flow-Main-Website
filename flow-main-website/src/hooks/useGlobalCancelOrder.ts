import { RequestType } from "@/types/types";
import getRequestData from "@/utils/getRequestData";
import handleHookCatch from "@/utils/handleHookCatch";
import handleResponseNotOk from "@/utils/handleResponseNotOk";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const useGlobalCancelOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const globalCancelOrder = useCallback(
    async (orderId: string, cancelReason: string) => {
      try {
        setLoading(true);
        setError(null);

        const requestData: RequestType = {
          url: `/api/delivery/cancelOrder`,
          method: "POST",
          body: { orderId, cancelReason },
        };

        const response = await getRequestData({ requestData });

        if (!response.ok) {
          handleResponseNotOk(response, "Error in cancelling order");
          return null;
        }

        toast.success("Order Cancelled Successfuly!");

        const data = await response.json();
        return data;
      } catch (error) {
        handleHookCatch(error, setError, "Failed to cancel order");
        toast.error("Failed to cancel order");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { globalCancelOrder, loading, error };
};

export default useGlobalCancelOrder;
