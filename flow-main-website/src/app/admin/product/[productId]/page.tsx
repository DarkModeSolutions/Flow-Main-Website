"use client";

import ProductComponent from "@/components/admin/ProductComponent";
import useGetProductById from "@/hooks/useGetProductById";
import { AllProductDetails } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AdminProductPage = () => {
  const params = useParams();
  const productId = params.productId as string;

  const router = useRouter();

  const [product, setProduct] = useState<AllProductDetails | null>(null);

  const { getProductById, loading, error } = useGetProductById();

  useEffect(() => {
    async function fetchProduct(productId: string) {
      const prod = await getProductById(productId);

      if (prod === null) {
        router.push("/admin");
        console.log("Product not found, redirecting to /admin: ", error);
        return;
      }
      setProduct(prod);
    }

    if (productId) {
      fetchProduct(productId);
    }
  }, [getProductById, productId, router, error]);

  if (loading) return <div>Loading...</div>;

  return <div>{product && <ProductComponent product={product} />}</div>;
};

export default AdminProductPage;
