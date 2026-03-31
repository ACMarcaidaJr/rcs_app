import { NextRequest, NextResponse } from "next/server";
import { fetchFromDataverse } from "@/lib/fetchFromDataverse";
import { handleApiError } from "@/lib/api-error";
import { prefixKeysWithCrc9f } from "@/lib/prefixKey";

export async function POST(req: NextRequest) {
    try {
        const { rcs_roleid, is_active } = await req.json();
        await fetchFromDataverse({
            table: `${process.env.ROLE_TABLE}(${rcs_roleid})`,
            method: "PATCH",
            body: prefixKeysWithCrc9f({
                is_active: `${is_active}`,
            }),
        });

        return NextResponse.json({
            success: true,
            message_title: "Update Status",
            message: "Role status updated successfully",
        });
    } catch (error) {
        return handleApiError(error, req, "Failed to update role");
    }
}