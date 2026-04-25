import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';

export async function GET(req: NextRequest) {
    try {

        const queries = {
            total: ``, 
            permanent: `crc9f_time_value eq 'P'`,
            temporary: `crc9f_time_value eq 'T'`,
            nap: `crc9f_is_nap_grds eq 1` 
        };

        const [totalRes, permRes, tempRes, napRes] = await Promise.all([
            fetchFromDataverse({ 
                table: process.env.RECORD_SERIES_ITEM_TABLE!, 
                query: `${queries.total ? `$filter=${queries.total}&` : ''}$count=true&$top=1` 
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
            message_title: 'Global Statistics Fetched',
            message: 'Successfully calculated record series metrics across all offices',
        });

    } catch (err) {
        return handleApiError(err, req, 'Count Error', 'Failed to retrieve record statistics');
    }
}