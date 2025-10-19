import { prisma } from "@/lib/db/prisma";
import { error } from "@/utils/errorResponse";
import getUserDetails from "@/utils/getUserDetails";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserDetails(req);

    if (!user) {
      return error(401, "Unauthorized");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        zohoAccessToken: null,
        zohoRefreshToken: null,
        zohoRefreshTokenCounter: 0,
        zohoTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: "All Zoho Tokens are nulls" });
  } catch (err) {
    await log(
      "Auth_Sign_Out",
      `Registration error: ${
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
