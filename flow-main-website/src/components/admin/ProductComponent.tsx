"use client";

import FlowButton from "@/components/FlowButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useUpdateProductForAdmin from "@/hooks/useUpdateProductForAdmin";
import { ProductRequest } from "@/types/adminTypes";
import { AllProductDetails } from "@/types/types";
import { images } from "@/utils/constants";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ProductComponent = ({ product }: { product: AllProductDetails }) => {
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
    <div className="pt-12 p-6">
      <div className="relative w-full not-md:h-[200px] h-[400px] flex justify-center items-center">
        <Image
          src={prodImage}
          alt={productData.name}
          fill
          className="w-[200px] md:object-contain"
        />
      </div>
      <div>
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="flex flex-col gap-4 mb-7">
            <Label htmlFor="name">Name:</Label>
            <Input
              id="name"
              value={productData.name}
              onChange={(e) =>
                setProductData({ ...productData, name: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-4 mb-7">
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
          <div className="flex flex-col gap-4 mb-7">
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
          <div className="flex flex-col gap-4 mb-7">
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

          <div className="flex justify-center items-center md:mt-10">
            <FlowButton submitType={true} className="md:w-[30%]">
              {loading ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Please wait
                </>
              ) : (
                "Update Product"
              )}
            </FlowButton>
          </div>
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
