"use client";

import ProductCard from "@/components/admin/ProductCard";
import useGetAllProducts from "@/hooks/useGetAllProducts";
import { ProductDetailsWithIncludes } from "@/types/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AdminHomePage = () => {
  const router = useRouter();

  const [products, setProducts] = useState<
    ProductDetailsWithIncludes[] | null | undefined
  >();

  const { error, getAllProducts, loading } = useGetAllProducts();

  useEffect(() => {
    async function fetchProducts() {
      const prods = await getAllProducts();

      if (prods === null || prods === undefined) {
        setProducts(null);
        return;
      }

      setProducts(prods);
    }

    fetchProducts();
  }, [getAllProducts]);

  return (
    <div>
      {loading ? (
        "Loading..."
      ) : error ? (
        <span>Error: {`${error}`}</span>
      ) : (
        <div>
          <h2>Products in Database: {products ? products?.length : 0}</h2>
          <div>
            {products?.map((product) => (
              <div
                key={product.id}
                onClick={() => router.push(`/admin/product/${product.id}`)}
              >
                <ProductCard
                  img={product.imageUrl}
                  name={product.name}
                  key={product.id}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHomePage;
