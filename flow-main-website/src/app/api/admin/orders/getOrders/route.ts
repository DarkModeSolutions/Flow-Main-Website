import { prisma } from "@/lib/db/prisma";
import { error } from "@/utils/errorResponse";
import getUserDetails from "@/utils/getUserDetails";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserDetails(req);
    if (!user || !user.isAdmin) {
      await log("Get_Orders", `Unauthorized fetching orders attempt.`);
      return error(403, "Unauthorized");
    }

    const orders = await prisma.orders.findMany({
      include: {
        orderItems: true,
        shadowfaxOrder: true,
      },
    });

    if (!orders || orders.length === 0) {
      await log("Get_Orders", `No orders found in the database.`);
      return NextResponse.json(
        { orders: [], message: "No orders found" },
        { status: 200 }
      );
    }

    await log("Get_Orders", `Fetched ${orders.length} orders successfully.`);

    return NextResponse.json(
      { orders, message: `${orders.length} orders found` },
      { status: 200 }
    );
  } catch (err) {
    await log(
      "Get_Orders",
      `Fetching Orders failed: ${
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
