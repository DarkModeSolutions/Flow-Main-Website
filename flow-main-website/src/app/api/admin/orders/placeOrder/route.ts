import { prisma } from "@/lib/db/prisma";
import { RequestType, ShadowfaxOrderPayload } from "@/types/types";
import { error } from "@/utils/errorResponse";
import getShadowfaxRequestData from "@/utils/getShadowfaxRequestData";
import getUserDetails from "@/utils/getUserDetails";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      orderId,
      pickupAddressId,
      acceptOrderRequest = true,
    } = await req.json();

    const user = await getUserDetails(req);
    if (!user || !user.isAdmin) {
      await log("Place_Order", `Unauthorized place order attempt.`);
      return error(403, "Unauthorized");
    }

    if (acceptOrderRequest) {
      const orderDetails = await prisma.orders.findUnique({
        where: { id: orderId },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          user: {
            omit: {
              password: true,
              createdAt: true,
              updatedAt: true,
              zohoAccessToken: true,
              zohoRefreshToken: true,
              zohoTokenExpiry: true,
              zohoRefreshTokenCounter: true,
            },
            include: {
              address: true,
            },
          },
        },
      });

      if (!orderDetails || !orderDetails.orderPhone) {
        await log(
          "Place_Order",
          `Order not found or invalid order details for Order ID: ${orderId}`
        );
        return error(404, "Order not found");
      }

      const orderAddress = orderDetails?.user.address.find(
        (addr) =>
          orderDetails.orderAddress ===
          `${addr.addressLine1}, ${
            addr.addressLine2 ? addr.addressLine2 + ", " : ""
          }${addr.city} - ${addr.pincode}`
      );

      if (!orderAddress) {
        await log(
          "Place_Order",
          `Order address not found for Order ID: ${orderId}`
        );
        return error(400, "Order address not found");
      }

      const pickupAddress = await prisma.pickupAddresses.findUnique({
        where: { id: pickupAddressId },
      });

      if (!pickupAddress || !pickupAddress.contactPhone) {
        await log(
          "Place_Order",
          `Pickup address not found or invalid for Order ID: ${orderId}`
        );
        return error(400, "Pickup address not found or invalid");
      }

      const createShadowfaxOrderPayload: ShadowfaxOrderPayload = {
        order_type: "marketplace",
        order_details: {
          client_order_id: orderDetails.id,
          product_value: orderDetails.total,
          payment_mode: "Prepaid",
          cod_amount: 0,
        },
        customer_details: {
          name: orderDetails?.user.name || "Customer",
          contact: orderDetails?.orderPhone,
          address_line_1: orderAddress?.addressLine1,
          address_line_2: orderAddress?.addressLine2 || "",
          city: orderAddress?.city,
          state: orderAddress?.state,
          pincode: Number(orderAddress?.pincode),
        },
        pickup_details: {
          contact: pickupAddress?.contactPhone,
          address_line_1: pickupAddress?.addressLine1,
          address_line_2: pickupAddress?.addressLine2 || "",
          city: pickupAddress?.city,
          state: pickupAddress?.state,
          pincode: Number(pickupAddress?.pincode),
        },
        rts_details: {
          name: "Deepak",
          contact: pickupAddress?.contactPhone,
          address_line_1: pickupAddress?.addressLine1,
          city: pickupAddress?.city,
          state: pickupAddress?.state,
          pincode: Number(pickupAddress?.pincode),
        },
        product_details: orderDetails.orderItems.map((item) => ({
          sku_name: item.product.name,
          price: item.product.price,
        })),
      };

      // const stringifyPayload = JSON.stringify(createShadowfaxOrderPayload);

      // const response = await fetch(
      //   `${process.env.SHADOWFAX_PROD_URL}/v3/clients/orders/`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Token ${process.env.SHADOWFAX_PROD_TOKEN}`,
      //     },
      //     body: stringifyPayload,
      //   }
      // );

      const requestData: RequestType = {
        url: "/v3/clients/orders/",
        method: "POST",
        body: createShadowfaxOrderPayload,
      };

      const response = await getShadowfaxRequestData({ requestData });

      if (!response.ok) {
        const respText = await response.text();
        await log(
          "Place_Order",
          `Shadowfax API responded with status ${response.status} for Order ID: ${orderId}. Response: ${respText}`
        );
        return error(
          response.status,
          `Failed to place order with Shadowfax: ${respText}`
        );
      }

      const shadowfaxData = await response.json();

      if (shadowfaxData.message === "Failure") {
        await log(
          "Place_Order",
          `Shadowfax API returned failure message for Order ID: ${orderId}. Response: ${JSON.stringify(
            shadowfaxData
          )}`
        );
        return NextResponse.json(
          {
            message: shadowfaxData.message,
            errors: shadowfaxData.errors,
          },
          { status: 200 }
        );
      }

      const newShadowfaxOrder = await prisma.shadowfaxOrders.create({
        data: {
          order: {
            connect: { id: orderDetails.id },
          },
          awb_number: shadowfaxData.data.awb_number,
          shipment_status: "CREATED",
        },
      });

      return NextResponse.json({
        message: "Success",
        errors: null,
        data: shadowfaxData.data,
        shadowfaxOrderAwbNumber: newShadowfaxOrder.awb_number,
      });
    } else {
      await log(
        "Place_Order",
        `Place order request not accepted for Order ID: ${orderId}`
      );
      return error(400, "Place order request not accepted");
    }
  } catch (err) {
    await log(
      "Place_Order",
      `Place Order failed: ${
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
