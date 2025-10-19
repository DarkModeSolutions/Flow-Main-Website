import { RequestType } from "@/types/types";
import getRequestData from "@/utils/getRequestData";
import handleResponseNotOk from "@/utils/handleResponseNotOk";
import { useCallback, useState } from "react";

const useUserSignOut = () => {
  const [loading, setLoading] = useState(false);

  const userSignOut = useCallback(async () => {
    try {
      setLoading(true);

      const requestData: RequestType = {
        url: "/api/auth/logOut",
        method: "POST",
      };

      const response = await getRequestData({ requestData });

      if (!response.ok) {
        handleResponseNotOk(response, "Error in Signing out user");
        return null;
      }

      return { message: "User signed out successfully" };
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { userSignOut, loading };
};

export default useUserSignOut;
