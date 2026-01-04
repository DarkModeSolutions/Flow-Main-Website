import { RequestType } from "@/types/types";
import getRequestData from "@/utils/getRequestData";
import handleResponseNotOk from "@/utils/handleResponseNotOk";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const useUpdateUserAddress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | unknown | null>(null);

  const updateUserAddress = useCallback(
    async ({
      updatedAddressLine1 = null,
      updatedAddressLine2 = null,
      updatedPincode = null,
      updatedCity = null,
      updatedState = null,
      updatedCountry = null,
      updatedAddressName = null,
      userId,
      addressId,
    }: {
      updatedAddressLine1: string | null | undefined;
      updatedAddressLine2: string | null | undefined;
      updatedPincode: string | null | undefined;
      updatedCity: string | null | undefined;
      updatedState: string | null | undefined;
      updatedCountry: string | null | undefined;
      updatedAddressName: string | null | undefined;
      userId: string;
      addressId: string;
    }) => {
      try {
        setLoading(true);
        setError(null);

        const requestData: RequestType = {
          url: `/api/user/${userId}/updateUserAddressDetails/${addressId}`,
          method: "PATCH",
          body: {
            updatedAddressLine1,
            updatedAddressLine2,
            updatedPincode,
            updatedCity,
            updatedState,
            updatedCountry,
            updatedAddressName,
          },
        };

        const response = await getRequestData({ requestData });

        if (!response.ok) {
          handleResponseNotOk(response, "updating user address details");
          throw new Error(
            `Failed to update user address details: ${response.statusText}`
          );
        }

        toast.success("User Address Updated Successfully!");
        return await response.json();
      } catch (error) {
        setError(error);
        console.error("Error updating user address details:", error);
        toast.error("or updating user address details");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateUserAddress, loading, error };
};

export default useUpdateUserAddress;
