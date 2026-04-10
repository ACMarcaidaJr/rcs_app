import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';
import { getToken } from "next-auth/jwt"


export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const officeGuid = token?.userOffice;
        
        // Base filter for the specific office
        const baseFilter = `crc9f_office_id/crc9f_rcs_officeid eq '${officeGuid}'`;

        // Define the specific count queries
        const queries = {
            total: `${baseFilter}`,
            permanent: `${baseFilter} and crc9f_time_value eq 'P'`,
            temporary: `${baseFilter} and crc9f_time_value eq 'T'`,
            nap: `${baseFilter} and crc9f_is_nap_grds eq 1` 
        };

        // Execute all counts in parallel for speed
        const [totalRes, permRes, tempRes, napRes] = await Promise.all([
            fetchFromDataverse({ 
                table: process.env.RECORD_SERIES_ITEM_TABLE!, 
                query: `$filter=${queries.total}&$count=true&$top=1` 
            }),
            fetchFromDataverse({ 
                table: process.env.RECORD_SERIES_ITEM_TABLE!, 
                query: `$filter=${queries.permanent}&$count=true&$top=1` 
            }),
            fetchFromDataverse({ 
                table: process.env.RECORD_SERIES_ITEM_TABLE!, 
                query: `$filter=${queries.temporary}&$count=true&$top=1` 
            }),
            fetchFromDataverse({ 
                table: process.env.RECORD_SERIES_ITEM_TABLE!, 
                query: `$filter=${queries.nap}&$count=true&$top=1` 
            }),
        ]);

        return NextResponse.json({
            success: true,
            stats: {
                total: totalRes["@odata.count"] || 0,
                permanent: permRes["@odata.count"] || 0,
                temporary: tempRes["@odata.count"] || 0,
                nap_validated: napRes["@odata.count"] || 0,
            },
            message_title: 'Statistics Fetched',
            message: 'Successfully calculated record series metrics',
        });

    } catch (err) {
        return handleApiError(err, req, 'Count Error', 'Failed to retrieve record statistics');
    }
}