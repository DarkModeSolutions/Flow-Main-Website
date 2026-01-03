import { prisma } from "@/lib/db/prisma";
import { error } from "@/utils/errorResponse";
import getUserDetails from "@/utils/getUserDetails";
import { log } from "@/utils/log";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const userDetails = await getUserDetails(req);

    if (!userDetails) {
      await log("Update_User_Passwor_Details", `User not authenticated.`);
      return error(401, "User not authenticated");
    }

    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/");

    // Get user ID (assuming it's at index -2: /api/user/[id]/zoho-status)
    const userId = pathSegments.slice(-2, -1)[0]; // Gets [id] part

    if (userDetails.id !== userId && !userDetails.isAdmin) {
      await log(
        "Update_User_Passwor_Details",
        `User ID mismatch: Authenticated user ID ${userDetails.id} does not match path user ID ${userId}.`
      );
      return error(403, "Forbidden: You can only update your own details");
    }

    const currentUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!currentUser) {
      await log(
        "Update_User_Passwor_Details",
        `User not found with ID: ${userId}`
      );
      return error(404, "User not found");
    }

    const updatedPasswword = await req.json();

    const hashedPassword = await bcrypt.hash(updatedPasswword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    await log(
      "Update_User_Passwor_Details",
      `Password updated for user with ID: ${userId}`
    );

    return NextResponse.json(
      {
        message: "Password Updated Successfully!",
      },
      { status: 200 }
    );
  } catch (err) {
    await log(
      "Update_User_Passwor_Details",
      `Update user failed: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
    return error(
      500,
      "Internal Server Error",
      err instanceof Error ? err.message : "Unknown error"
    );
  }
}
