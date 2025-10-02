"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useUpdateProductForAdmin from "@/hooks/useUpdateProductForAdmin";
import { ProductRequest } from "@/types/adminTypes";
import { ProductDetailsWithIncludes } from "@/types/types";
import { images } from "@/utils/constants";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ProductComponent = ({
  product,
}: {
  product: ProductDetailsWithIncludes;
}) => {
  const router = useRouter();

  const [productData, setProductData] = useState(product);

  const { error, loading, updateProductForAdmin } = useUpdateProductForAdmin();

  const prodImage = product.imageUrl
    ? images[product.imageUrl as keyof typeof images]
    : "/assets/images/default-product.png"; // Fallback image

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProductData: Partial<ProductRequest> = {
      description: productData.description || "",
      name: productData.name,
      price: productData.price,
      stock: productData.stock,
    };

    const updatedProduct = await updateProductForAdmin(
      productData.id,
      updatedProductData
    );

    if (updatedProduct !== null) {
      router.push("/admin/");
    }
  };

  return (
    <div>
      <div>
        <Image src={prodImage} alt={productData.name} />
      </div>
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name:</Label>
            <Input
              id="name"
              value={productData.name}
              onChange={(e) =>
                setProductData({ ...productData, name: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="description">Description:</Label>
            {/* <Input type="" id="description" value={productData.description || ""} /> */}
            <Textarea
              id="description"
              value={productData.description || ""}
              onChange={(e) =>
                setProductData({ ...productData, description: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="price">Price:</Label>
            <Input
              type="number"
              id="price"
              value={productData.price.toString()}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  price: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="stock">Stock:</Label>
            <Input
              type="number"
              id="stock"
              value={productData.stock.toString()}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  stock: parseInt(e.target.value),
                })
              }
            />
          </div>

          <Button size="sm" disabled={loading} type="submit">
            {loading ? (
              <>
                <Loader2Icon className="animate-spin" />
                Please wait
              </>
            ) : (
              "Update Product"
            )}
          </Button>
        </form>

        {error && (
          <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
            <p className="text-red-400 text-sm">
              Error in Updating Product: {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductComponent;
