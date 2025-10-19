// import { prisma } from "@/lib/db/prisma";
import { getValidZohoAccessToken } from "@/utils/zohoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, amount, description } = await req.json();

    if (!userId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Step 1: Get valid Zoho access token
    const accessToken = await getValidZohoAccessToken(userId);

    // Step 2: Prepare payment session payload (Zoho API format)
    const payload = {
      amount: amount,
      currency_code: "INR",
      description: description || "Payment for Order",
      redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
    };

    // Step 3: Make API call to Zoho Payments
    const response = await fetch(
      "https://payments.zoho.in/api/v1checkout/session",
      {
        method: "POST",
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Zoho Error:", data);
      return NextResponse.json(
        { error: "Failed to create payment session", details: data },
        { status: 500 }
      );
    }

    // Step 4: Return Zoho’s checkout link to frontend
    return NextResponse.json({
      success: true,
      checkout_url: data.checkout_url || data.data?.checkout_url,
    });
  } catch (error) {
    console.error("Payment session error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
