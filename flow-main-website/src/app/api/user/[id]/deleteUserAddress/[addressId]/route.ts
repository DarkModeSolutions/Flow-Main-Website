import { prisma } from "@/lib/db/prisma";
import { error } from "@/utils/errorResponse";
import getUserDetails from "@/utils/getUserDetails";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    console.log("Entering delete API Layer");

    const userDetails = await getUserDetails(req);

    if (!userDetails) {
      await log("Delete_User_Address_Details", `User not authenticated.`);
      return error(401, "User not authenticated");
    }

    const url = new URL(req.url);
    const addressId = url.pathname.split("/").pop();
    const id = url.pathname.split("/").slice(-3, -2)[0];

    console.log("Id: ", id);
    console.log("AddressId: ", addressId);

    if (userDetails.id !== id && !userDetails.isAdmin) {
      await log(
        "Delete_User_Address_Details",
        `User ID mismatch: Authenticated user ID ${userDetails.id} does not match path user ID ${id}.`
      );
      return error(403, "Forbidden: You can only update your own details");
    }

    if (!addressId) {
      await log(
        "Delete_User_Address_Details",
        `Address ID not provided in request.`
      );
      return error(400, "Address ID is required");
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    await log(
      "Delete_User_Address_Details",
      `Successfully deleted address with ID ${addressId} for user ID ${id}.`
    );

    return NextResponse.json(
      {
        message: "Address deleted successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    await log(
      "Delete_User_Address_Details",
      `Delete user address failed: ${
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
