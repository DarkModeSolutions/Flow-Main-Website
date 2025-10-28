import { prisma } from "@/lib/db/prisma";
import { error } from "@/utils/errorResponse";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("entered register as user");
    const { email, phone, name, address, age } = await req.json();
    const {
      addressLine1,
      addressLine2 = "",
      pincode,
      city,
      state,
      country,
    } = address;

    console.log("All data recieved");

    if (!email || !phone || !name || !address) {
      return error(400, "Email, phone, address and name are required");
    }

    let user;

    const existingUser = await prisma.user.findFirst({
      where: { email, phone, buyingAsGuest: true },
      omit: {
        password: true,
        createdAt: true,
        updatedAt: true,
      },
      include: {
        address: true,
      },
    });

    if (existingUser) {
      user = existingUser;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          address: {
            create: {
              addressLine1,
              addressLine2,
              pincode,
              city,
              state,
              country,
              addressName: "Guest Home",
            },
          },
        },
      });
      await log("Auth_Guest", `User with email: ${email}`);
    } else {
      user = await prisma.user.create({
        data: {
          name: name,
          email: email,
          phone: phone,
          buyingAsGuest: true,
          address: {
            create: {
              addressLine1,
              addressLine2,
              pincode,
              city,
              state,
              country,
              addressName: "Guest Home",
            },
          },
          age: age,
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
      include: {
        address: true,
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
