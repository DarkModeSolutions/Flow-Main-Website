import { prisma } from "@/lib/db/prisma";

export async function getValidZohoAccessToken(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.zohoAccessToken || !user?.zohoRefreshToken) {
    throw new Error("User not linked with Zoho.");
  }

  // Try using the existing token first
  const test = await fetch("https://www.zohoapis.in/crm/v2/users", {
    headers: { Authorization: `Zoho-oauthtoken ${user.zohoAccessToken}` },
  });

  if (test.status === 401) {
    // Token expired — refresh it
    const payload = new URLSearchParams({
      refresh_token: user.zohoRefreshToken,
      client_id: process.env.ZOHO_CLIENT_ID!,
      client_secret: process.env.ZOHO_CLIENT_SECRET!,
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
      data: { zohoAccessToken: data.access_token },
    });

    return data.access_token;
  }

  // Token still valid
  return user.zohoAccessToken;
}
