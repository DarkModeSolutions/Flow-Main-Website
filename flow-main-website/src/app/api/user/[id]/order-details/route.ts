import { prisma } from "@/lib/db/prisma";
import { error } from "@/utils/errorResponse";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    console.log("Entering API layer");
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/");
    const userId = pathSegments.slice(-2, -1)[0]; // Gets [id] part

    console.log("here");

    if (!userId) {
      await log(
        "Get_Order_Details_By_User_ID",
        `User ID not provided in request.`
      );
      return error(400, "User ID is required");
    }

    const orders = await prisma.orders.findMany({
      where: { userId: userId },
      omit: {
        updatedAt: true,
        payment_link_id: true,
      },
      include: {
        orderItems: true,
        _count: true,
      },
    });

    if (!orders || orders.length === 0) {
      await log(
        "Get_Order_Details_By_User_ID",
        `No orders found for User ID: ${userId}`
      );
      return NextResponse.json(
        {
          message: "No orders found for this user",
          orders: [],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: `${orders.length} found for User ID: ${userId}`,
        orders,
      },
      { status: 200 }
    );
  } catch (err) {
    await log(
      "Get_Order_Details_By_User_ID",
      `Get order details by user id failed: ${
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
