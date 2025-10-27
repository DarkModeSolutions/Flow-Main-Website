import { OrderDetailsWiithIncludes, RequestType } from "@/types/types";
import getRequestData from "@/utils/getRequestData";
import handleResponseNotOk from "@/utils/handleResponseNotOk";
import { useCallback, useState } from "react";

const useGetOrderDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | unknown | null>(null);

  const getOrderDetails = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const requestData: RequestType = {
        url: `/api/user/${userId}/orderDetails`,
        method: "GET",
      };

      const response = await getRequestData({ requestData });

      if (!response.ok) {
        handleResponseNotOk(response, "fetching order details for user");
        throw new Error(
          `Failed to fetch order details for user with ID: ${userId}`
        );
      }

      const data = await response.json();
      return (data.orders as OrderDetailsWiithIncludes[]) || [];
    } catch (error) {
      setError(error);
      console.error("Error fetching order details for user:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { getOrderDetails, loading, error };
};

export default useGetOrderDetails;
