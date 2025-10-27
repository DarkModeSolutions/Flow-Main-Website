import { prisma } from "@/lib/db/prisma";
import { error } from "@/utils/errorResponse";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(_req: NextRequest) {
  try {
    const searchTags = [
      {
        name: "FLOW Hydration Lemonade",
        tags: ["lemon", "lemonade", "citrus", "refreshing", "tangy"],
      },
      {
        name: "FLOW Hydration Original",
        tags: ["original", "regular", "classic"],
      },
      {
        name: "FLOW Hydration Mango",
        tags: ["mango", "tropical", "fruity", "sweet"],
      },
    ];

    const productsList = await prisma.products.findMany();

    for (const product of productsList) {
      const tagEntry = searchTags.find((prod) => prod.name === product.name);
      if (tagEntry) {
        await prisma.products.update({
          where: { id: product.id },
          data: { searchTags: tagEntry.tags },
        });
        await log(
          "Temp_Update_Products",
          `Updated product ${product.name} with tags: ${tagEntry.tags.join(
            ", "
          )}`
        );
      } else {
        await log(
          "Temp_Update_Products",
          `No tags found for product ${product.name}, skipping update.`
        );
      }
    }

    return NextResponse.json({
      message: "Products Updated Successfully",
    });
  } catch (err) {
    await log(
      "Temp_Update_Products",
      `Temp_Update_Products error: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
    return error(
      500,
      "Internal server error",
      err instanceof Error ? err.message : "Unknown error"
    );
  }
}
