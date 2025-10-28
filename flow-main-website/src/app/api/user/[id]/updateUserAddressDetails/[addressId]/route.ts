import { prisma } from "@/lib/db/prisma";
import { error } from "@/utils/errorResponse";
import getUserDetails from "@/utils/getUserDetails";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const userDetails = await getUserDetails(req);

    if (!userDetails) {
      await log("Update_User_Address_Details", `User not authenticated.`);
      return error(401, "User not authenticated");
    }

    const url = new URL(req.url);
    const addressId = url.pathname.split("/").pop();
    const id = url.pathname.split("/").slice(-3, -2)[0];

    if (userDetails.id !== id) {
      await log(
        "Update_User_Address_Details",
        `User ID mismatch: Authenticated user ID ${userDetails.id} does not match path user ID ${id}.`
      );
      return error(403, "Forbidden: You can only update your own details");
    }

    if (!addressId) {
      await log(
        "Update_User_Address_Details",
        `Address ID not provided in request.`
      );
      return error(400, "Address ID is required");
    }

    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId },
    });

    const body = await req.json();
    const {
      updatedAddressLine1,
      updatedAddressLine2,
      updatedPincode,
      updatedCity,
      updatedState,
      updatedCountry,
      updatedAddressName,
    } = body;

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        addressLine1: updatedAddressLine1 ?? existingAddress?.addressLine1,
        addressLine2: updatedAddressLine2 ?? existingAddress?.addressLine2,
        pincode: updatedPincode ?? existingAddress?.pincode,
        city: updatedCity ?? existingAddress?.city,
        state: updatedState ?? existingAddress?.state,
        country: updatedCountry ?? existingAddress?.country,
        addressName: updatedAddressName ?? existingAddress?.addressName,
      },
    });

    return NextResponse.json(
      {
        address: updatedAddress,
        message: "Updated address successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    await log(
      "Update_User_Address_Details",
      `Update user address failed: ${
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
