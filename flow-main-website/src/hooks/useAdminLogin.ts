import { RequestType } from "@/types/types";
import getRequestData from "@/utils/getRequestData";
import handleResponseNotOk from "@/utils/handleResponseNotOk";
import { useState } from "react";

const useAdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const adminLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const requestData: RequestType = {
        url: "/api/admin/auth/login",
        method: "POST",
        body: { email, password },
      };

      const res = await getRequestData({ requestData });

      if (!res.ok) {
        handleResponseNotOk(res, "Admin Login Failed");
      }

      const data = await res.json();

      return data.user;
    } catch (error) {
      console.log("Error admin login:", error);
    } finally {
      setLoading(false);
    }
  };

  return { adminLogin, loading, error };
};

export default useAdminLogin;
