"use client";

import AdminModuleComponent from "@/components/admin/AdminModuleComponent";

interface AdminModules {
  title: string;
  url: string;
  isDisabled?: boolean;
}

const AdminHomePage = () => {
  const adminModules: AdminModules[] = [
    {
      title: "User Management",
      url: "/admin/users",
    },
    {
      title: "Product Management",
      url: "/admin/products",
    },
    {
      title: "Order Management",
      url: "/admin/orders",
    },
    {
      title: "Analytics Dashboard",
      url: "/admin/analytics",
      isDisabled: true,
    },
    {
      title: "Promotions & Discounts",
      url: "/admin/promotions",
    },
  ];

  return (
    <div className="min-h-screen w-full">
      <h1 className="text-2xl manrope-bold manrope">Admin Modules</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {adminModules
          .sort((a, b) => {
            if (a.isDisabled && !b.isDisabled) return 1;
            if (!a.isDisabled && b.isDisabled) return -1;
            return 0;
          })
          .map((module, index) => (
            <AdminModuleComponent
              key={index}
              title={module.title}
              url={module.url}
              isDisabled={module.isDisabled === undefined ? false : true}
            />
          ))}
      </div>
    </div>
  );
};

export default AdminHomePage;
