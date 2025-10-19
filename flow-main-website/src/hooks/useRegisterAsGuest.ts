import { RequestType } from "@/types/types";
import getRequestData from "@/utils/getRequestData";
import handleResponseNotOk from "@/utils/handleResponseNotOk";
import { useCallback, useState } from "react";

const useRegisterAsGuest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerAsGuest = useCallback(
    async (email: string, name: string, phone: string) => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors

        const requestData: RequestType = {
          url: "/api/auth/registerAsGuest",
          method: "POST",
          body: { email, name, phone },
        };

        const res = await getRequestData({ requestData });

        if (!res.ok) {
          handleResponseNotOk(res, "Error in fetching product by ID");
          return null;
        }

        const data = await res.json();

        console.log(data);

        return data.user;
      } catch (error) {
        console.log("Error registering user as guest:", error);
        setError("Network error occurred");
        return { success: false, error: "Network error occurred" };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { registerAsGuest, loading, error };
};

export default useRegisterAsGuest;
