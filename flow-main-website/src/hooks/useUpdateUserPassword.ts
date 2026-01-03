import { RequestType } from "@/types/types";
import getRequestData from "@/utils/getRequestData";
import handleResponseNotOk from "@/utils/handleResponseNotOk";
import { useCallback, useState } from "react";

const useUpdateUserPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | unknown | null>(null);

  const updateUserPassword = useCallback(
    async (updatedPassword: string, userId: string) => {
      try {
        setLoading(true);
        setError(null);

        const requestData: RequestType = {
          url: `/api/user/${userId}/updateUserPassword`,
          method: "PATCH",
          body: updatedPassword,
        };

        const response = await getRequestData({ requestData });

        if (!response.ok) {
          handleResponseNotOk(response, "updating user password");
          throw new Error(
            `Failed to update user password: ${response.statusText}`
          );
        }

        return await response.json();
      } catch (error) {
        setError(error);
        console.error("Error updating user password:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, updateUserPassword };
};

export default useUpdateUserPassword;
