import { ProductProvider } from "@/contexts/ProductContext";
import React from "react";

const AllContextProviders = ({ children }: { children: React.ReactNode }) => {
  return <ProductProvider>{children}</ProductProvider>;
};

export default AllContextProviders;
