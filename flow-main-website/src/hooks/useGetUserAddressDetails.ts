import { RequestType } from "@/types/types";
import getRequestData from "@/utils/getRequestData";
import handleResponseNotOk from "@/utils/handleResponseNotOk";
import { useCallback, useState } from "react";

const useGetUserAddressDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | unknown | null>(null);

  const getUserAddressDetails = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const requestData: RequestType = {
        url: `/api/user/${userId}/getUserAddressDetails`,
        method: "GET",
      };

      const response = await getRequestData({ requestData });

      if (!response.ok) {
        handleResponseNotOk(response, "fetching user address details");
        throw new Error(
          `Failed to fetch user address details: ${response.statusText}`
        );
      }

      const data = await response.json();

      return data.addresses;
    } catch (error) {
      setError(error);
      console.error("Error fetching user address details:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { getUserAddressDetails, loading, error };
};

export default useGetUserAddressDetails;
