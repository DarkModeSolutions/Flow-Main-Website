import { prisma } from "@/lib/db/prisma";
import { error } from "@/utils/errorResponse";
import getUserDetails from "@/utils/getUserDetails";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const userDetails = await getUserDetails(req);

    if (!userDetails) {
      await log("Update_User_Details", `User not authenticated.`);
      return error(401, "User not authenticated");
    }

    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/");

    // Get user ID (assuming it's at index -2: /api/user/[id]/zoho-status)
    const userId = pathSegments.slice(-2, -1)[0]; // Gets [id] part

    if (userDetails.id !== userId) {
      await log(
        "Update_User_Details",
        `User ID mismatch: Authenticated user ID ${userDetails.id} does not match path user ID ${userId}.`
      );
      return error(403, "Forbidden: You can only update your own details");
    }

    const currentUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!currentUser) {
      await log("Update_User_Details", `User not found with ID: ${userId}`);
      return error(404, "User not found");
    }

    const body = await req.json();

    const {
      updatedAddress,
      updatedAge,
      updatedEmail,
      updatedPhone,
      updatedName,
    } = body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: updatedName ?? currentUser.name,
        address: updatedAddress ?? currentUser.address,
        age: Number(updatedAge) ?? Number(currentUser.age),
        email: updatedEmail ?? currentUser.email,
        phone: updatedPhone ?? currentUser.phone,
      },
    });

    return NextResponse.json(
      {
        user: updatedUser,
        message: "User details updated successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    await log(
      "Update_User_Details",
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
