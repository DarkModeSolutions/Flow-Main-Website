import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const signature = req.headers.get("x-zohopay-signature") || "";
  const payload = await req.text();

  const computed = crypto
    .createHmac("sha256", process.env.WEBHOOK_SIGNING_KEY!)
    .update(payload)
    .digest("hex");

  if (signature !== computed) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(payload);

  // Example: log the event
  console.log("✅ Payment Webhook Received:", event);

  // TODO: mark order as paid in your database
  return NextResponse.json({ received: true });
}
