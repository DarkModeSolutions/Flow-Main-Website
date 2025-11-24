import { prisma } from "@/lib/db/prisma";
import { RequestType } from "@/types/types";
import { error } from "@/utils/errorResponse";
import getShadowfaxRequestData from "@/utils/getShadowfaxRequestData";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const orderId = url.pathname.split("/").pop();

    const orderDetails = await prisma.orders.findUnique({
      where: { id: orderId },
      include: { shadowfaxOrder: true },
    });

    if (!orderDetails || !orderDetails.shadowfaxOrder) {
      await log(
        "Get_Delivery_Order_Details",
        `Order not found or no Shadowfax order for Order ID: ${orderId}`
      );
      return error(404, "Order not found or no Shadowfax order associated");
    }

    const requestData: RequestType = {
      url: `v4/clients/orders/${orderDetails.shadowfaxOrder.awb_number}/track/`,
      method: "GET",
    };

    const response = await getShadowfaxRequestData({ requestData });

    if (!response.ok) {
      const errorData = await response.json();
      await log(
        "Get_Delivery_Order_Details",
        `Shadowfax get delivery order details failed for Order ID: ${orderId}, Error: ${JSON.stringify(
          errorData
        )}`
      );
      return error(
        500,
        "Failed to fetch delivery order details from Shadowfax",
        JSON.stringify(errorData)
      );
    }

    const responseData = await response.json();

    if (responseData.message === "Invalid AWB number") {
      await log(
        "Get_Delivery_Order_Details",
        `Shadowfax get delivery order details unsuccessful for Order ID: ${orderId}, Response: ${JSON.stringify(
          responseData
        )}`
      );

      return NextResponse.json(
        {
          message: responseData.message,
        },
        { status: 400 }
      );
    }

    await prisma.shadowfaxOrders.update({
      where: { orderId: orderId },
      data: { shipment_status: responseData.order_details.status },
    });

    return NextResponse.json(
      {
        message: "Success",
        data: responseData,
      },
      { status: 200 }
    );
  } catch (err) {
    await log(
      "Get_Delivery_Order_Details",
      `Get Delivery Order Details failed: ${
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
