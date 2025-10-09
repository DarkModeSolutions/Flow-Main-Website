import { ProductDetailsWithIncludes, RequestType } from "@/types/types";
import getRequestData from "@/utils/getRequestData";
import handleResponseNotOk from "@/utils/handleResponseNotOk";
import { useCallback, useState } from "react";

const useGetAllProducts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | unknown | null>(null);

  const getAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors

      const requestData: RequestType = {
        url: "/api/products/getAllProducts",
        method: "GET",
      };

      const response = await getRequestData({ requestData });

      if (!response.ok) {
        handleResponseNotOk(response, "Error in fetching products");
        return null;
      }

      const data = await response.json();
      return data.products as ProductDetailsWithIncludes[] | null;
    } catch (error) {
      setError(error);
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { getAllProducts, loading, error };
};

export default useGetAllProducts;
