import AdminPageHeader from "@/components/admin/AdminPageHeader";
import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-transparent min-h-screen w-full flex flex-col items-center justify-between">
      <div className="sticky top-0 z-50 bg-black/30 backdrop-blur-md w-full">
        <AdminPageHeader />
      </div>
      <div className="p-0 px-4 flex-1 w-full">{children}</div>
    </div>
  );
};

export default AdminLayout;
