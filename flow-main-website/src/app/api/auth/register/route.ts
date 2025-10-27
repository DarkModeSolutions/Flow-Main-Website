import { prisma } from "@/lib/db/prisma";
import { error } from "@/utils/errorResponse";
import { log } from "@/utils/log";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, address, phone, age } = await req.json();

    if (!email || !password) {
      return error(400, "Email and password are required");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.password === null) {
        return NextResponse.json(
          {
            message:
              "User already exists without a password. Please set a password.",
            tag: "set-password",
          },
          { status: 409 }
        );
      }
      return error(409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        address,
        phone,
        age,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: newUser.id },
      omit: {
        createdAt: true,
        updatedAt: true,
        password: true,
      },
    });

    await log("Auth_Register", `User registered with email: ${email}`);
    return NextResponse.json(
      { message: "User registered successfully", user: user },
      { status: 201 }
    );
  } catch (err) {
    await log(
      "Auth_Register",
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
