import { RequestType } from "@/types/types";
import getRequestData from "@/utils/getRequestData";
import handleResponseNotOk from "@/utils/handleResponseNotOk";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const useUpdateUserDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | unknown | null>(null);

  const updateUserDetails = useCallback(
    async ({
      updatedName = null,
      updatedAge = null,
      updatedEmail = null,
      updatedPhone = null,
      userId,
    }: {
      updatedName: string | null | undefined;
      updatedAge: number | null | undefined;
      updatedEmail: string | null | undefined;
      updatedPhone: string | null | undefined;
      userId: string;
    }) => {
      try {
        setLoading(true);
        setError(null);

        const requestData: RequestType = {
          url: `/api/user/${userId}/updateDetails`,
          method: "PATCH",
          body: {
            // updatedAddress,
            updatedAge,
            updatedEmail,
            updatedPhone,
            updatedName,
          },
        };

        const response = await getRequestData({ requestData });

        if (!response.ok) {
          handleResponseNotOk(response, "updating user details");
          throw new Error(
            `Failed to update user details: ${response.statusText}`
          );
        }

        toast.success("User Details Updated Successfully!", {
          autoClose: 1500,
        });
        return await response.json();
      } catch (error) {
        setError(error);
        console.error("Error updating user details:", error);
        toast.error("Error updating user details");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateUserDetails, loading, error };
};

export default useUpdateUserDetails;
