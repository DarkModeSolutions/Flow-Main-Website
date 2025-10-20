import { getZohoAccessToken } from "@/app/api/zoho/payment-session/route";
import { prisma } from "@/lib/db/prisma";
import { error } from "@/utils/errorResponse";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    const existingOrder = await prisma.orders.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        {
          message:
            "Please contact our support team. Email Id at the footer of the page.",
          orderFullfillmentStatus: "PENDING",
        },
        { status: 404 }
      );
    }

    if (!existingOrder.payment_link_id) {
      return NextResponse.json(
        {
          message: "Payment link not found",
          orderFullfillmentStatus: "PENDING",
        },
        { status: 400 }
      );
    }

    const accessToken = await getZohoAccessToken();

    const getPaymentDetails = await fetch(
      `https://payments.zoho.in/api/v1/paymentlinks/${existingOrder.payment_link_id}?account_id=${process.env.ACCOUNT_ID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      }
    );

    const paymentData = await getPaymentDetails.json();

    if (
      paymentData.code === 0 &&
      paymentData?.payment_links?.status === "paid"
    ) {
      await prisma.orders.update({
        where: { id: existingOrder.id },
        data: {
          status: "COMPLETED",
        },
      });

      return NextResponse.json(
        { message: "Payment Successful", orderFullfillmentStatus: "COMPLETED" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message:
          "Payment Pending. Please contact our support team. Email Id at the footer of the page.",
        orderFullfillmentStatus: "PENDING",
      },
      { status: 200 }
    );
  } catch (err) {
    await log(
      "Product_Purchase",
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
