import { prisma } from "@/lib/db/prisma";
import { error } from "@/utils/errorResponse";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.pathname.split("/").pop();

    if (!userId) {
      await log("Get_User_By_ID", `User ID not provided in request.`);
      return NextResponse.json(
        {
          message: "No user id provided",
        },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      await log("Get_User_By_ID", `User not found with ID: ${userId}`);
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user,
        message: "User retrieved successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    await log(
      "Get_User_By_ID",
      `Get user by id failed: ${
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
