import getUserDetails from "@/utils/getUserDetails";
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

    const accessToken = await getValidZohoAccessToken(userId);
    const userData = await getUserDetails(req);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const expires_at = tomorrow.toISOString().split("T")[0];

    const bodyData = JSON.stringify({
      amount: Number(amount).toFixed(2),
      currency: "INR",
      email: userData?.email,
      phone: `${userData?.phone}`,
      reference_id: `REF-${Date.now()}`,
      description: description || "Payment for Order",
      expires_at,
      notify_user: true,
      return_url:
        process.env.NODE_ENV === "development"
          ? "https://www.flowhydration.in"
          : `${process.env.PAYMENT_SUCCESS_URL}/payment/success`,
    });

    console.log("Body Data: ", bodyData);

    const response = await fetch(
      `https://payments.zoho.in/api/v1/paymentlinks?account_id=${process.env.ACCOUNT_ID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: bodyData,
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

    console.log("Response Data in payment session: ", data);

    // const checkoutUrl = `https://payments.zoho.in/checkout?session_id=${data.payment_links.url}`;

    return NextResponse.json({
      success: true,
      checkout_url: data.payment_links.url,
    });
  } catch (error) {
    console.error("Payment session error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
