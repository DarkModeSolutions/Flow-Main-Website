import { getZohoAccessToken } from "@/app/api/zoho/payment-session/route";
import { prisma } from "@/lib/db/prisma";
import { error } from "@/utils/errorResponse";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const { orderId, paymentLink } = await req.json();

    await log(
      "Product_Purchase",
      `Product_Purchase logging: orderId or paymentLink received - ${orderId}, ${paymentLink}`
    );

    console.log(
      "Received PATCH request with orderId:",
      orderId,
      "and paymentLink:",
      paymentLink
    );

    let existingOrder;

    if (orderId) {
      existingOrder = await prisma.orders.findUnique({
        where: { id: orderId },
        include: { orderItems: true },
      });
    } else if (paymentLink) {
      existingOrder = await prisma.orders.findFirst({
        where: { payment_link_id: paymentLink },
        include: { orderItems: true },
      });
    } else {
      await log(
        "Product_Purchase",
        `Product_Purchase error: orderId or paymentLink not provided`
      );
      throw new Error("orderId or paymentLink not provided");
    }

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

    if (existingOrder.status === "COMPLETED") {
      return NextResponse.json(
        {
          message: "Order already processed",
          orderFullfillmentStatus: "COMPLETED",
        },
        { status: 200 }
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
      await Promise.all(
        existingOrder.orderItems.map(async (item) => {
          const product = await prisma.products.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            throw new Error(`Product ${item.productId} not found`);
          }

          if (product.stock < item.quantity) {
            throw new Error(
              `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
            );
          }

          return prisma.products.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        })
      );

      await prisma.orders.update({
        where: { id: existingOrder.id },
        data: {
          status: "COMPLETED",
          deliveryStatus: "PROCESSING",
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
      `Product_Purchase error: ${
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
