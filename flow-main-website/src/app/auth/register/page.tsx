"use client";

import AuthComponent from "@/components/auth/AuthComponent";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

const AuthRegisterPage = () => {
  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <AuthComponent isSignUp />
      </Suspense>
    </div>
  );
};

export default AuthRegisterPage;
