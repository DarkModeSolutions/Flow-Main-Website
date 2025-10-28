import { prisma } from "@/lib/db/prisma";
import { error } from "@/utils/errorResponse";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/");
    const userId = pathSegments.slice(-2, -1)[0]; // Gets [id] part

    if (!userId) {
      await log(
        "Get_Address_Details_By_User_ID",
        `User ID not provided in request.`
      );
      return error(400, "User ID is required");
    }

    const addresses = await prisma.address.findMany({
      where: { userId: userId },
    });

    if (!addresses || addresses.length === 0) {
      await log(
        "Get_Order_Details_By_User_ID",
        `No addresses found for User ID: ${userId}`
      );
      return NextResponse.json(
        {
          message: "No addresses found for this user",
          addresses: [],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: `${addresses.length} addresses found for User ID: ${userId}`,
        addresses,
      },
      { status: 200 }
    );
  } catch (err) {
    await log(
      "Get_Address_Details_By_User_ID",
      `Get address details by user id failed: ${
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
