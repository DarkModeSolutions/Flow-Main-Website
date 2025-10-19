import { prisma } from "@/lib/db/prisma";
import { error } from "@/utils/errorResponse";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, phone, name } = await req.json();

    if (!email || !phone || !name) {
      return error(400, "Email, phone, and name are required");
    }

    let user;

    const existingUser = await prisma.user.findFirst({
      where: { email, phone, buyingAsGuest: true },
      omit: {
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (existingUser) {
      user = existingUser;
      await log("Auth_Guest", `User with email: ${email}`);
    } else {
      user = await prisma.user.create({
        data: {
          name: name,
          email: email,
          phone: phone,
          buyingAsGuest: true,
        },
      });
      await log(
        "Auth_Register_As_Guest",
        `User registered with email: ${email}`
      );
    }

    const loggedInUser = await prisma.user.findUnique({
      where: { id: user.id },
      omit: {
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { message: "User success", user: loggedInUser },
      { status: 200 }
    );
  } catch (err) {
    await log(
      "Guest_Auth_Register",
      `Registration error: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
    return error(
      500,
      "Internal server error",
      err instanceof Error ? err.message : "Unknown error"
    );
  }
}
