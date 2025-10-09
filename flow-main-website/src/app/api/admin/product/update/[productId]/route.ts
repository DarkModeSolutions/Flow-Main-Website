import { log } from "@/utils/log";
import { error } from "@/utils/errorResponse";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { ProductRequest } from "@/types/adminTypes";
import getUserDetails from "@/utils/getUserDetails";

export async function PATCH(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const productId = url.pathname.split("/").pop();

    const user = await getUserDetails(req);
    if (!user || !user.isAdmin) {
      await log("Product_Update", `Unauthorized product update attempt.`);
      return error(403, "Unauthorized");
    }

    const product = await prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      await log("Product_Update", `Product not found with ID: ${productId}`);
      return error(404, "Product not found");
    }

    const body: ProductRequest = await req.json();

    const updatedBody: Partial<ProductRequest> = {};
    if (body.name !== null && body.name !== undefined)
      updatedBody.name = body.name;
    if (body.description !== null && body.description !== undefined)
      updatedBody.description = body.description;
    if (body.price !== null && body.price !== undefined)
      updatedBody.price = body.price;
    if (body.stock !== null && body.stock !== undefined)
      updatedBody.stock = body.stock;
    if (body.imageUrl !== null && body.imageUrl !== undefined)
      updatedBody.imageUrl = body.imageUrl;

    const updatedProduct = await prisma.products.update({
      where: { id: productId },
      data: updatedBody,
    });

    if (!updatedProduct) {
      await log("Product_Update", `Product update failed for ID: ${productId}`);
      return error(500, "Product update failed");
    }

    await log(
      "Product_Update",
      `Product updated successfully with ID: ${productId}`
    );
    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (err) {
    await log(
      "Update_Product",
      `Product update failed: ${err instanceof Error ? err.message : "Unknown error"}`
    );
    return error(
      500,
      "Product update failed",
      err instanceof Error ? err.message : "Unknown error"
    );
  }
}
