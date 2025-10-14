"use client";

import AuthComponent from "@/components/auth/AuthComponent";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

const AdminAuthLoginPage = () => {
  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <AuthComponent isAdmin />
      </Suspense>
    </div>
  );
};

export default AdminAuthLoginPage;
