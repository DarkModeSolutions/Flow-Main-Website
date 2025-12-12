import { prisma } from "@/lib/db/prisma";
import { RequestType } from "@/types/types";
import { error } from "@/utils/errorResponse";
import getShadowfaxRequestData from "@/utils/getShadowfaxRequestData";
import getUserDetails from "@/utils/getUserDetails";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { orderId, cancelReason } = await req.json();

    const user = await getUserDetails(req);

    const orderDetails = await prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        shadowfaxOrder: { omit: { createdAt: true, updatedAt: true } },
      },
    });

    if (!orderDetails || !orderDetails.shadowfaxOrder) {
      await log(
        "Cancel_Order",
        `Order not found or no Shadowfax order for Order ID: ${orderId}`
      );
      return error(404, "Order not found or no Shadowfax order associated");
    }

    const requestData: RequestType = {
      url: "v3/clients/orders/cancel/",
      method: "POST",
      body: {
        request_id: orderDetails.shadowfaxOrder.awb_number,
        cancel_remarks: cancelReason,
      },
    };

    const response = await getShadowfaxRequestData({ requestData });

    if (!response.ok) {
      const errorData = await response.json();
      await log(
        "Cancel_Order",
        `Shadowfax cancel order failed for Order ID: ${orderId}, Error: ${JSON.stringify(
          errorData
        )}`
      );
      return error(
        500,
        "Failed to cancel order with Shadowfax",
        JSON.stringify(errorData)
      );
    }

    const responseData = await response.json();

    if (responseData.responseCode !== 200) {
      await log(
        "Cancel_Order",
        `Shadowfax cancel order unsuccessful for Order ID: ${orderId}, Response: ${JSON.stringify(
          responseData
        )}`
      );
      return NextResponse.json(
        {
          message: responseData.responseMsg,
        },
        { status: responseData.responseCode }
      );
    }

    await prisma.shadowfaxOrders.update({
      where: { orderId: orderId },
      data: {
        shipment_status: "CANCELLED",
      },
    });

    await prisma.orders.update({
      where: { id: orderId },
      data: {
        deliveryStatus: user?.isAdmin
          ? "CANCELLED_BY_ADMIN"
          : "CANCELLED_BY_USER",
      },
    });

    return NextResponse.json(
      {
        message: "Order cancelled successfully",
        data: responseData,
      },
      { status: 200 }
    );
  } catch (err) {
    await log(
      "Cancel_Order",
      `Cancel Order failed: ${
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
