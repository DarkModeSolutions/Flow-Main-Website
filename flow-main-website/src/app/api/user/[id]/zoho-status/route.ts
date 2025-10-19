import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pathSegments = url.pathname.split("/");

  // Get user ID (assuming it's at index -2: /api/user/[id]/zoho-status)
  const userId = pathSegments.slice(-2, -1)[0]; // Gets [id] part

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      zohoAccessToken: true,
      zohoRefreshToken: true,
      zohoTokenExpiry: true,
    },
  });

  return NextResponse.json({
    linked: !!(
      user?.zohoAccessToken &&
      user?.zohoRefreshToken &&
      user?.zohoTokenExpiry &&
      user.zohoTokenExpiry > new Date()
    ),
  });
}
