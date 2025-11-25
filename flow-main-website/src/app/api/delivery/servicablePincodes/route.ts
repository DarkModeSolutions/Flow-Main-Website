import { RequestType } from "@/types/types";
import { error } from "@/utils/errorResponse";
import getShadowfaxRequestData from "@/utils/getShadowfaxRequestData";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { pincode } = await req.json();

    const requestData: RequestType = {
      url: `/v1/clients/serviceability/?service=customer_delivery&page=1&count=10&pincodes=${pincode}`,
      additionalHeaders: {
        "Content-Length": "0",
      },
      method: "GET",
    };

    const response = await getShadowfaxRequestData({ requestData });

    if (!response.ok) {
      const errorData = await response.json();
      await log(
        "Fetch_Servicable_Pincodes",
        `Shadowfax fetch servicable pincodes failed for Pincode: ${pincode}, Error: ${JSON.stringify(
          errorData
        )}`
      );
      return error(
        500,
        "Failed to fetch servicable pincodes from Shadowfax",
        JSON.stringify(errorData)
      );
    }

    const responseData = await response.json();

    if (
      responseData.status === "FAILED" ||
      responseData.message === "Invalid Request"
    ) {
      await log(
        "Fetch_Servicable_Pincodes",
        `Shadowfax fetch servicable pincodes unsuccessful for Pincode: ${pincode}, Response: ${JSON.stringify(
          responseData
        )}`
      );
      return NextResponse.json(
        {
          message: responseData.message,
        },
        { status: responseData.status === "FAILED" ? 401 : 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Pincode is servicable",
        data: responseData,
      },
      { status: 200 }
    );
  } catch (err) {
    await log(
      "Fetch_Servicable_Pincodes",
      `Fetching Servicable Pincodes failed: ${
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
