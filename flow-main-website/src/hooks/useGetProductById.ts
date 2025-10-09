import { ProductDetailsWithIncludes, RequestType } from "@/types/types";
import getRequestData from "@/utils/getRequestData";
import handleHookCatch from "@/utils/handleHookCatch";
import handleResponseNotOk from "@/utils/handleResponseNotOk";
import { useCallback, useState } from "react";

const useGetProductById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProductById = useCallback(async (productId: string) => {
    try {
      setLoading(true);

      const requestData: RequestType = {
        url: `/api/products/getProductById/${productId}`,
        method: "GET",
      };

      const response = await getRequestData({ requestData });

      if (!response.ok) {
        handleResponseNotOk(response, "Error in fetching product by ID");
        return null;
      }

      const data = await response.json();

      return (data.product as ProductDetailsWithIncludes) || null;
    } catch (error) {
      handleHookCatch(error, setError, "Failed to fetch product by ID");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getProductById, loading, error };
};

export default useGetProductById;
