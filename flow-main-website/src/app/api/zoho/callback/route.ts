// /app/api/zoho/callback/route.ts
import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // optional if you use it
  //   const userId = searchParams.get("user_id"); // pass this from frontend

  if (!code || !state) {
    return NextResponse.json(
      { error: "Missing code or user ID" },
      { status: 400 }
    );
  }

  const client_id = process.env.ZOHO_CLIENT_ID!;
  const client_secret = process.env.ZOHO_CLIENT_SECRET!;
  const redirect_uri = `${process.env.REDIRECT_URI}/api/zoho/callback`;

  const payload = new URLSearchParams({
    code,
    client_id,
    client_secret,
    redirect_uri,
    grant_type: "authorization_code",
  });

  const response = await fetch("https://accounts.zoho.in/oauth/v2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload.toString(),
  });

  const data = await response.json();

  if (!data.access_token || !data.refresh_token) {
    return NextResponse.json(
      { error: "Failed to get tokens", details: data },
      { status: 500 }
    );
  }

  // Store tokens in DB
  await prisma.user.update({
    where: { id: state },
    data: {
      zohoAccessToken: data.access_token,
      zohoRefreshToken: data.refresh_token,
      zohoTokenExpiry: new Date(Date.now() + data.expires_in * 1000),
    },
  });

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/cart?zoho=linked`
  );
}
