import { NextRequest, NextResponse } from "next/server";
import { fetchFromDataverse } from "@/lib/fetchFromDataverse";
import { handleApiError } from "@/lib/api-error";
import { prefixKeysWithCrc9f } from "@/lib/prefixKey";

export async function POST(req: NextRequest) {
  try {
    const { rcs_userid, is_active } = await req.json();
    console.log("rcs_userid%%%%%%%", rcs_userid, "is_active", is_active)
    await fetchFromDataverse({
      table: `${process.env.USER_TABLE}(${rcs_userid})`,
      method: "PATCH",
      body: prefixKeysWithCrc9f({
        is_active,
      }),
    });

    return NextResponse.json({
      success: true,
      message_title: "Update Status",
      message: "User status updated successfully",
    });
  } catch (error) {
    return handleApiError(error, req, "Failed to update user");
  }
}