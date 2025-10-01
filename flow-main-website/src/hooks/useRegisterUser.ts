import {
  RegisterResult,
  RegisterUserResponse,
  RequestType,
} from "@/types/types";
import getRequestData from "@/utils/getRequestData";
import { useState } from "react";

const useRegisterUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerUser = async (
    email: string,
    password: string
  ): Promise<RegisterResult> => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors

      const requestData: RequestType = {
        url: "/api/auth/register",
        method: "POST",
        body: { email, password },
      };

      const res = await getRequestData({ requestData });
      let responseData: RegisterUserResponse;

      if (!res.ok) {
        responseData = await res.json();
        if (responseData.tag === "set-password") {
          setError("User exists without password. Please set a password.");
          return { success: "tagged", tag: "set-password" };
        }
        setError(responseData.message || "Registration failed");
        return {
          success: false,
          error: responseData.message || "Registration failed",
        };
      }

      responseData = await res.json();
      if (responseData.user) {
        return { success: true, user: responseData.user };
      }

      return null;
    } catch (error) {
      console.log("Error registering user:", error);
      setError("Network error occurred");
      return { success: false, error: "Network error occurred" };
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error };
};

export default useRegisterUser;
