import { prisma } from "@/lib/db/prisma";
import generateAuthToken from "@/utils/generateAuthToken";

export async function getValidZohoAccessToken(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { address: true },
  });
  if (!user?.zohoAccessToken || !user?.zohoRefreshToken) {
    throw new Error("User not linked with Zoho.");
  }

  // Try using the existing token first
  const test = await fetch("https://payments.zoho.in/api/v1/", {
    headers: { Authorization: `Zoho-oauthtoken ${user.zohoAccessToken}` },
  });

  if (test.status === 401) {
    console.log("Refreshing Token in Zoho Client");

    if (user.zohoRefreshTokenCounter > 19) {
      console.log("Generating a new auth token for new refresh token");
      generateAuthToken(user);
    }

    // Token expired — refresh it
    const payload = new URLSearchParams({
      refresh_token: user.zohoRefreshToken,
      client_id: process.env.CLIENT_ID!,
      client_secret: process.env.CLIENT_SECRET!,
      grant_type: "refresh_token",
    });

    const res = await fetch("https://accounts.zoho.in/oauth/v2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload.toString(),
    });

    const data = await res.json();

    if (!data.access_token) throw new Error("Failed to refresh Zoho token.");

    // Save new token in DB
    await prisma.user.update({
      where: { id: userId },
      data: {
        zohoAccessToken: data.access_token,
        zohoRefreshTokenCounter: (user.zohoRefreshTokenCounter || 0) + 1,
      },
    });

    return data.access_token;
  }

  // Token still valid
  return user.zohoAccessToken;
}
