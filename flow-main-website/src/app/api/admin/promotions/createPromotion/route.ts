import { prisma } from "@/lib/db/prisma";
import { error } from "@/utils/errorResponse";
import getUserDetails from "@/utils/getUserDetails";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code, discount, description, validFrom, validTo, isActive } =
      await req.json();

    if (!code || !discount || !validFrom || !validTo) {
      await log(
        "Create_Promotion",
        `Promotion code creation failed: Missing required fields`
      );
      return error(
        400,
        "Missing required fields: code, discount, validFrom, validTo"
      );
    }

    const user = await getUserDetails(req);
    if (!user || !user.isAdmin) {
      await log(
        "Create_Promotion",
        `Unauthorized promotion code creation attempt.`
      );
      return error(403, "Unauthorized");
    }

    const existingPromotion = await prisma.promotionCodes.findUnique({
      where: { code: code },
    });

    if (existingPromotion) {
      await log(
        "Create_Promotion",
        `Promotion code creation failed: Code ${code} already exists`
      );
      return error(409, "Promotion code already exists");
    }

    const newPromotion = await prisma.promotionCodes.create({
      data: {
        code,
        discount,
        description: description || "",
        validFrom,
        validTo,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    await log(
      "Create_Promotion",
      `Promotion code created successfully: Code ${code}, ID: ${newPromotion.id}`
    );

    return NextResponse.json(
      {
        message: "Promotion Code created successfully",
        promotion: newPromotion,
      },
      { status: 201 }
    );
  } catch (err) {
    await log(
      "Create_Promotion",
      `Create Prromotion failed: ${
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
