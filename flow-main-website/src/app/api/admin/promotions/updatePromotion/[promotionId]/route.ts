import { prisma } from "@/lib/db/prisma";
import { PromotionRequest } from "@/types/adminTypes";
import { error } from "@/utils/errorResponse";
import getUserDetails from "@/utils/getUserDetails";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const promotionId = url.pathname.split("/").pop();

    const user = await getUserDetails(req);
    if (!user || !user.isAdmin) {
      await log("Update_Promotion", `Unauthorized product update attempt.`);
      return error(403, "Unauthorized");
    }

    const promotion = await prisma.promotionCodes.findUnique({
      where: { id: promotionId },
    });

    if (!promotion) {
      await log(
        "Update_Promotion",
        `Promotion not found with ID: ${promotionId}`
      );
      return error(404, "Promotion not found");
    }

    const body: PromotionRequest = await req.json();

    const updatedBody: Partial<PromotionRequest> = {};
    if (body.code !== null && body.code !== undefined)
      updatedBody.code = body.code;
    if (body.discount !== null && body.discount !== undefined)
      updatedBody.discount = body.discount;
    if (body.description !== null && body.description !== undefined)
      updatedBody.description = body.description;
    if (body.validFrom !== null && body.validFrom !== undefined)
      updatedBody.validFrom = body.validFrom;
    if (body.validTo !== null && body.validTo !== undefined)
      updatedBody.validTo = body.validTo;
    if (body.isActive !== null && body.isActive !== undefined)
      updatedBody.isActive = body.isActive;

    const updatedPromotion = await prisma.promotionCodes.update({
      where: { id: promotionId },
      data: updatedBody,
    });

    if (!updatedPromotion) {
      await log(
        "Update_Promotion",
        `Promotion update failed for ID: ${promotionId}`
      );
      return error(500, "Promotion update failed");
    }

    await log(
      "Update_Promotion",
      `Promotion updated successfully with ID: ${promotionId}`
    );

    return NextResponse.json(
      {
        message: "Promotion updated successfully",
        promotion: updatedPromotion,
      },
      { status: 200 }
    );
  } catch (err) {
    await log(
      "Update_Promotion",
      `Update Prromotion failed: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
    return error(
      500,
      "Internal Server Error",
      err instanceof Error ? err.message : "Unknown error"
    );
  }
}
