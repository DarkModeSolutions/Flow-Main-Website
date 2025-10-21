import { prisma } from "@/lib/db/prisma";
import { Cart } from "@/types/types";
import getUserDetails from "@/utils/getUserDetails";
import { NextRequest, NextResponse } from "next/server";

let ZOHO_ACCESS_TOKEN: string | null = null;

const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID!;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET!;
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN!;

async function refreshZohoAccessToken() {
  const res = await fetch(
    `https://accounts.zoho.in/oauth/v2/token?refresh_token=${ZOHO_REFRESH_TOKEN}&client_id=${ZOHO_CLIENT_ID}&client_secret=${ZOHO_CLIENT_SECRET}&grant_type=refresh_token`,
    { method: "POST" }
  );

  const data = await res.json();

  if (data.access_token) {
    ZOHO_ACCESS_TOKEN = data.access_token;
    return ZOHO_ACCESS_TOKEN;
  } else {
    throw new Error(
      "Failed to refresh Zoho access token: " + JSON.stringify(data)
    );
  }
}

export async function getZohoAccessToken() {
  if (!ZOHO_ACCESS_TOKEN) {
    return await refreshZohoAccessToken();
  }
  return ZOHO_ACCESS_TOKEN;
}

// Named export for POST
export async function POST(req: NextRequest) {
  try {
    // const body = await req.json();
    const { cart, amount, description } = await req.json();

    const userData = await getUserDetails(req);

    console.log("This is user data: ", userData);

    const order = await prisma.orders.create({
      data: {
        userId: userData?.id || "guest-user",
        // payment_link_id: data.payment_links.payment_link_id,
        total: Number(amount),
        status: "PENDING",
        orderEmail: userData?.email,
        orderPhone: userData?.phone,
        orderAddress: userData?.address,
        orderItems: {
          create: cart.map((item: Cart) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    const accessToken = await getZohoAccessToken();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const expires_at = tomorrow.toISOString().split("T")[0];

    const bodyData = {
      amount: Number(amount), // ✅ ensure it's a number
      currency: "INR",
      email: userData?.email || "guest@example.com", // fallback if undefined
      phone: `${userData?.phone || ""}`, // empty string if no phone
      reference_id: `REF-${Date.now()}`,
      description: description?.slice(0, 500) || "Payment for Order", // max 500 chars
      expires_at,
      notify_user: true,
      return_url:
        process.env.NODE_ENV === "development"
          ? `https://flow-main-website.vercel.app/payment/success?orderId=${order.id}`
          : `${process.env.REDIRECT_URI}/payment/success?orderId=${order.id}`,
    };

    console.log(
      "Body Data:",
      JSON.stringify(bodyData),
      process.env.ACCOUNT_ID,
      accessToken
    );

    // Convert to JSON only when passing to fetch
    const response = await fetch(
      `https://payments.zoho.in/api/v1/paymentlinks?account_id=${process.env.ACCOUNT_ID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      }
    );

    console.log("This is response: ", response);

    const data = await response.json();

    console.log("This is data: ", data);

    if (data.code === 0 && data.payment_links?.url) {
      const updatedOrder = await prisma.orders.update({
        where: { id: order.id },
        data: {
          payment_link_id: data.payment_links?.payment_link_id,
        },
      });

      return NextResponse.json({
        success: true,
        checkout_url: data.payment_links?.url,
        orderId: updatedOrder.id,
      });
    }

    return NextResponse.json({ success: false, error: data }, { status: 400 });
  } catch (err) {
    console.error("Zoho Payment API error:", err);
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}
