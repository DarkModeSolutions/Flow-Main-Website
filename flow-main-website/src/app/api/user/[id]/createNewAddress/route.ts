import { prisma } from "@/lib/db/prisma";
import { error } from "@/utils/errorResponse";
import getUserDetails from "@/utils/getUserDetails";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userDetails = await getUserDetails(req);

    if (!userDetails) {
      await log("Create_User_Address_Details", `User not authenticated.`);
      return error(401, "User not authenticated");
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").slice(-2, -1)[0];

    // console.log();

    if (userDetails.id !== id && !userDetails.isAdmin) {
      await log(
        "Create_User_Address_Details",
        `User ID mismatch: Authenticated user ID ${userDetails.id} does not match path user ID ${id}.`
      );
      return error(403, "Forbidden: You can only update your own details");
    }

    const body = await req.json();
    const {
      addressLine1,
      addressLine2,
      pincode,
      city,
      state,
      country,
      addressName,
    } = body;

    const newAddress = await prisma.address.create({
      data: {
        addressLine1,
        addressLine2,
        pincode,
        city,
        state,
        country,
        addressName,
        user: { connect: { id: userDetails.id } },
      },
    });

    console.log("New address created: ", newAddress);

    return NextResponse.json(
      {
        address: newAddress,
        message: `New address created for User Id: ${userDetails.id}`,
      },
      { status: 201 }
    );
  } catch (err) {
    await log(
      "Create_User_Address_Details",
      `Create user address failed: ${
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
