import { RequestType } from "@/types/types";
import getRequestData from "@/utils/getRequestData";
import handleHookCatch from "@/utils/handleHookCatch";
import { useCallback, useState } from "react";

const useUpdatePurchaseOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updatePurchaseOrder = useCallback(async (orderId: string) => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      setSuccess(null); // Clear previous success messages

      const requestData: RequestType = {
        url: `/api/products/productPurchase`,
        method: "PATCH",
        body: JSON.stringify({ orderId }),
      };

      const response = await getRequestData({ requestData });

      const data = await response.json();

      if (data?.orderFullfillmentStatus === "PENDING") {
        setError(data?.message);
        return data;
      } else if (data?.orderFullfillmentStatus === "COMPLETED") {
        setSuccess("Order completed successfully.");
        return data;
      }
    } catch (error) {
      handleHookCatch(error, setError, "Failed to update product");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updatePurchaseOrder, loading, error, success };
};

export default useUpdatePurchaseOrder;
