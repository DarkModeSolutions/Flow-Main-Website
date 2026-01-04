import { RequestType } from "@/types/types";
import getRequestData from "@/utils/getRequestData";
import handleResponseNotOk from "@/utils/handleResponseNotOk";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const useDeleteUserAddress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | unknown | null>(null);

  const deleteUserAddress = useCallback(
    async (userId: string, addressId: string) => {
      try {
        setLoading(true);
        setError(null);

        console.log("Entering delete Hook");

        const requestData: RequestType = {
          url: `/api/user/${userId}/deleteUserAddress/${addressId}`,
          method: "DELETE",
        };

        const response = await getRequestData({ requestData });

        if (!response.ok) {
          handleResponseNotOk(response, "delete user address details");
          // throw new Error("Failed to delete user address details");
        }

        console.log("Response in delete hook: ", response);

        const data = await response.json();

        toast.success("Deleted User Address Successfully!", {
          autoClose: 1500,
        });

        return { data, success: true };
      } catch (error) {
        setError(error);
        console.error("Error deleting user address details:", error);
        toast.error("Error deleting user address details");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { deleteUserAddress, loading, error };
};

export default useDeleteUserAddress;
