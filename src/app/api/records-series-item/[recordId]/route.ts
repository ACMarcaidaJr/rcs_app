import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { getToken } from "next-auth/jwt";


// used in custodians and admin
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ recordId: string }> }
) {
    try {
        const { recordId } = await params;
        const body = await req.json();
        
        console.log("Incoming request body:", body);

        // 1. Destructure strictly. 
        // We MUST exclude the primary key, redundant IDs, and read-only OData fields.
        const {
            rcs_records_seriesid,      // ID for the lookup bind
            rcs_record_series_itemid,  // Primary Key (Read-only)
            record_series_item_id, // Potential duplicate (Read-only)
            utility_value,             // Processed manually below
            is_nap_grds,               // Processed manually below
            created_by,                // Read-only
            office_id,                 // Read-only
            createdon,                 // Read-only
            modifiedon,                // Read-only
            ...restOfData              // Titles and other standard fields
        } = body;

        // 2. Build the raw payload
        const rawPayload: any = {};

        // Process standard fields: exclude empty strings/null, but ALLOW 0 or false
        Object.keys(restOfData).forEach(key => {
            if (restOfData[key] !== "" && restOfData[key] !== undefined && restOfData[key] !== null) {
                rawPayload[key] = restOfData[key];
            }
        });

        // 3. Add transformed fields to rawPayload BEFORE prefixing
        // This ensures prefixKeysWithCrc9f adds "crc9f_" to these keys too.
        rawPayload.is_nap_grds = is_nap_grds ? 1 : 0;
        
        rawPayload.utility_value = typeof utility_value === 'string'
            ? utility_value
            : JSON.stringify(utility_value || []);

        // 4. Apply Prefixes
        const finalBody = prefixKeysWithCrc9f(rawPayload);

        // 5. Handle Lookups
        // Lookups require the @odata.bind suffix and MUST use the Entity Set Name
        if (rcs_records_seriesid) {
            // Ensure "record_series_id" matches the logical name of your lookup column
            finalBody["crc9f_record_series_id@odata.bind"] = `/${process.env.RECORD_SERIES_TITLE_TABLE}(${rcs_records_seriesid})`;
        }

        // console.log("PATCHING Record ID:", recordId);
        // console.log("FINAL PREFIXED BODY:", JSON.stringify(finalBody, null, 2));

        const updated_data = await fetchFromDataverse({
            table: `${process.env.RECORD_SERIES_ITEM_TABLE}(${recordId})`,
            method: 'PATCH',
            body: finalBody
        });

        return NextResponse.json({
            success: true,
            data: updated_data,
            message: 'Successfully updated the record.',
        });

    } catch (error) {
        console.error("PATCH Update Error:", error);
        return handleApiError(error, req, 'Update Failed');
    }
}