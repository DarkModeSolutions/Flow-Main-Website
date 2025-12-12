import { RequestType } from "@/types/types";
import getRequestData from "@/utils/getRequestData";
import handleHookCatch from "@/utils/handleHookCatch";
import handleResponseNotOk from "@/utils/handleResponseNotOk";
import { useCallback, useState } from "react";

const useGetOrdersForAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOrdersForAdmin = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const requestData: RequestType = {
        url: `/api/admin/orders/getOrders`,
        method: "GET",
      };

      const response = await getRequestData({ requestData });

      if (!response.ok) {
        handleResponseNotOk(response, "Error in fetching orders for admin");
      }

      const data = await response.json();

      return data.orders;
    } catch (error) {
      handleHookCatch(error, setError, "Failed to update product");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getOrdersForAdmin, loading, error };
};

export default useGetOrdersForAdmin;
