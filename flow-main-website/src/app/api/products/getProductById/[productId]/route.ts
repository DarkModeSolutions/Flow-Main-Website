import { prisma } from "@/lib/db/prisma";
import { error } from "@/utils/errorResponse";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const productId = url.pathname.split("/").pop();

    if (!productId) {
      await log("Get_Product_By_ID", `Product ID not provided in request.`);
      return error(400, "Product ID is required");
    }

    const product = await prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      await log("Get_Product_By_ID", `Product not found with ID: ${productId}`);
      return error(404, "Product not found");
    }

    return NextResponse.json(
      {
        product,
        message: "Product retrieved successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    await log(
      "Get_Product_By_ID",
      `Product retrieval failed: ${err instanceof Error ? err.message : "Unknown error"}`
    );
    return error(
      500,
      "Internal Server Error",
      err instanceof Error ? err.message : "Unknown error"
    );
  }
}
