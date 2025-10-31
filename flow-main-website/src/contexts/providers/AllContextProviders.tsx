import { ProductProvider } from "@/contexts/ProductContext";
import { UserProvider } from "@/contexts/UserContext";
import React from "react";

const AllContextProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <ProductProvider>{children}</ProductProvider>
    </UserProvider>
  );
};

export default AllContextProviders;
