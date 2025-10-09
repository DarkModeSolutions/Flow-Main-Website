import { prisma } from "@/lib/db/prisma";
import { error } from "@/utils/errorResponse";
import { log } from "@/utils/log";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.products.findMany();
    return NextResponse.json(
      { products, message: "Products retrieved successfully" },
      { status: 200 }
    );
  } catch (err) {
    await log(
      "Update_Product",
      `Product update failed: ${err instanceof Error ? err.message : "Unknown error"}`
    );
    return error(
      500,
      "Internal Server Error",
      err instanceof Error ? err.message : "Unknown error"
    );
  }
}
