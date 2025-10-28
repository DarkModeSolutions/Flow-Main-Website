import { prisma } from "@/lib/db/prisma";
import { UserDetailsWithIncludes } from "@/types/types";
import { log } from "@/utils/log";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export default async function getUserDetails(
  req: NextRequest
): Promise<UserDetailsWithIncludes | null> {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: token.email,
      },
      include: {
        address: true,
      },
      omit: {
        createdAt: true,
        updatedAt: true,
        password: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (err) {
    await log(
      "Get_User_Details",
      `Error fetching user details: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
    return null;
  }
}
