import { ProductRequest } from "@/types/adminTypes";
import { ProductDetailsWithIncludes, RequestType } from "@/types/types";
import getRequestData from "@/utils/getRequestData";
import handleHookCatch from "@/utils/handleHookCatch";
import handleResponseNotOk from "@/utils/handleResponseNotOk";
import { useState } from "react";

const useUpdateProductForAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProductForAdmin = async (
    productId: string,
    updatedData: Partial<ProductRequest>
  ) => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors

      const requestData: RequestType = {
        url: `/api/product/update${productId}`,
        method: "PATCH",
        body: updatedData,
      };

      const response = await getRequestData({ requestData });

      if (!response.ok) {
        handleResponseNotOk(response, "Error in updating product for admin");
      }

      const data = await response.json();

      return data.product as ProductDetailsWithIncludes | null;
    } catch (error) {
      //   const errorMessage =
      //     error instanceof Error ? error.message : "Failed to update product";
      //   setError(errorMessage);
      //   console.error("Error updating product:", error);
      handleHookCatch(error, setError, "Failed to update product");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateProductForAdmin, loading, error };
};

export default useUpdateProductForAdmin;
