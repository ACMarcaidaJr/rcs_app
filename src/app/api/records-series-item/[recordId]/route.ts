import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { getToken } from "next-auth/jwt";

export async function PATCH(
    req: NextRequest,
    // Ensure the key here matches your folder name exactly (e.g., [recordId])
    { params }: { params: { recordId: string } } 
) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const recordId = params.recordId;

        // 1. Destructure to STRIP OUT fields that Dataverse won't allow in a PATCH body
        const {
            rcs_records_seriesid,      // Lookup ID (handled via @odata.bind)
            rcs_record_series_itemid, // The Primary Key (CANNOT be in the body)
            utility_value,
            is_nap_grds,
            created_by,               // Read-only
            office_id,                // Read-only
            createdon,                // Read-only system field
            modifiedon,               // Read-only system field
            ...restOfData             // Only the actual editable fields
        } = await req.json();

        // 2. Build the sanitized payload
        const payload: any = {
            ...restOfData,
            is_nap_grds: is_nap_grds ? 1 : 0,
            utility_value: typeof utility_value === 'string' ? utility_value : JSON.stringify(utility_value || []),
        };

        // 3. Handle Lookup Binding (Optional: Only if it actually changed)
        if (rcs_records_seriesid) {
            payload["record_series_id@odata.bind"] = `/${process.env.RECORD_SERIES_TITLE_TABLE}(${rcs_records_seriesid})`;
        }

        // 4. Debugging Log (Crucial to find the syntax error)
        const finalBody = prefixKeysWithCrc9f(payload);
        console.log("PATCHING TABLE:", `${process.env.RECORD_SERIES_ITEM_TABLE}(${recordId})`);
        console.log("FINAL PREFIXED BODY:", JSON.stringify(finalBody, null, 2));

        const updated_data = await fetchFromDataverse({
            table: `${process.env.RECORD_SERIES_ITEM_TABLE}(${recordId})`,
            method: 'PATCH',
            body: finalBody
        });

        return NextResponse.json({
            success: true,
            data: updated_data,
            message_title: 'Update Series Item',
            message: 'Successfully updated the record properties.',
        });

    } catch (error) {
        console.error("Dataverse PATCH Error Details:", error);
        return handleApiError(error, req, 'Failed to update series item in Dataverse');
    }
}