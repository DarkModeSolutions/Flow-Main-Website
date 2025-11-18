import { prisma } from "@/lib/db/prisma";
import { error } from "@/utils/errorResponse";
import getUserDetails from "@/utils/getUserDetails";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const promotions = await prisma.promotionCodes.findMany();

    const user = await getUserDetails(req);
    if (!user || !user.isAdmin) {
      await log("Get_Promotions", `Unauthorized product update attempt.`);
      return error(403, "Unauthorized");
    }

    await log("Get_Promotions", `Fetched ${promotions.length} promotions`);

    if (promotions.length === 0) {
      return error(404, "No promotions found");
    }

    return NextResponse.json(
      {
        message: `Found ${promotions.length} promotions`,
        promotions: promotions,
      },
      { status: 200 }
    );
  } catch (err) {
    await log(
      "Get_Promotions",
      `Get Promotions failed: ${
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
