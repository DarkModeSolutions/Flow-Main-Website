import { RequestType } from "@/types/types";
import getRequestData from "@/utils/getRequestData";
import handleResponseNotOk from "@/utils/handleResponseNotOk";
import { useCallback, useState } from "react";

const useGetDeliveryOrderDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | unknown | null>(null);

  const getDeliveryOrderDetails = useCallback(async (orderId: string) => {
    try {
      setLoading(true);
      setError(null);

      const requestData: RequestType = {
        url: `/api/delivery/getDeliveryOrderDetails/${orderId}`,
        method: "GET",
      };

      const response = await getRequestData({ requestData });

      if (!response.ok) {
        handleResponseNotOk(
          response,
          "fetching delivery order details for customer"
        );
        throw new Error(
          `Failed to fetch delivery order details for customer with Order ID: ${orderId}`
        );
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      setError(error);
      console.error(
        "Error fetching delivery order details for customer:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return { getDeliveryOrderDetails, loading, error };
};

export default useGetDeliveryOrderDetails;
