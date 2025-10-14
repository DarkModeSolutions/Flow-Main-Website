"use client";

import AuthComponent from "@/components/auth/AuthComponent";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

const AuthLoginpage = () => {
  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <AuthComponent />
      </Suspense>
    </div>
  );
};

export default AuthLoginpage;
