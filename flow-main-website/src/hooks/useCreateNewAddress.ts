import { AddressAllDetails, RequestType } from "@/types/types";
import getRequestData from "@/utils/getRequestData";
import handleResponseNotOk from "@/utils/handleResponseNotOk";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const useCreateNewAddress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | unknown | null>(null);

  const createNewAddress = useCallback(
    async ({
      addressLine1 = null,
      addressLine2 = null,
      pincode = null,
      city = null,
      state = null,
      country = null,
      addressName = null,
      userId,
    }: {
      addressLine1: string | null | undefined;
      addressLine2: string | null | undefined;
      pincode: string | null | undefined;
      city: string | null | undefined;
      state: string | null | undefined;
      country: string | null | undefined;
      addressName: string | null | undefined;
      userId: string;
    }) => {
      try {
        setLoading(true);
        setError(null);

        const requestData: RequestType = {
          url: `/api/user/${userId}/createNewAddress`,
          method: "POST",
          body: {
            addressLine1,
            addressLine2,
            pincode,
            city,
            state,
            country,
            addressName,
          },
        };

        const response = await getRequestData({ requestData });

        if (!response.ok) {
          handleResponseNotOk(response, "creating new user address");
          throw new Error(
            `Failed to create new user address: ${response.statusText}`
          );
        }

        const data = await response.json();

        toast.success("New User Address Created Successfuly!", {
          autoClose: 1500,
        });

        return { data: data.address as AddressAllDetails, success: true };
      } catch (error) {
        setError(error);
        console.error("Error creating user address details:", error);
        toast.error("Error creating user address details");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createNewAddress, loading, error };
};

export default useCreateNewAddress;
