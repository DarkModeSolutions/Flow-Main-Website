import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, description, reference_id, customer } = await req.json();

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL;

    const response = await fetch(
      `${process.env.ZOHO_BASE_URL}/payment/request`,
      {
        method: "POST",
        headers: {
          Authorization: `Zoho-oauthtoken ${process.env.ZOHO_API_KEY}`,
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          amount,
          currency: "INR",
          description,
          reference_id,
          customer,
          callback_url: `${baseUrl}/payment/success`,
          failure_callback_url: `${baseUrl}/payment/failure`,
        }),
      }
    );

    const text = await response.text();
    console.log("Zoho raw response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse JSON. Raw response:", text);
      console.error("Error:", err);
      return NextResponse.json(
        { error: "Invalid Zoho response", raw: text },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error("Zoho Error:", data);
      return NextResponse.json({ error: data }, { status: 400 });
    }

    return NextResponse.json({
      payment_url: data.payment_url,
      payment_id: data.payment_id,
    });
  } catch (err) {
    console.error("Payment create error:", err);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
