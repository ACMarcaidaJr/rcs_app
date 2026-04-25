import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';
import { getToken } from "next-auth/jwt"



export async function GET(req: NextRequest, { params }: { params: Promise<{ officeguid: string }> }) {
    try {
        const { officeguid } = await params;

        const series = await fetchFromDataverse({
            table: `${process.env.RECORD_SERIES_TITLE_TABLE}`,
            query: `$filter=crc9f_office_id/crc9f_rcs_officeid eq '${officeguid}'&$select=crc9f_rcs_record_series_titleid, crc9f_record_series_title`
        });

        console.log("stripPrefixFromKeys(series.value)", stripPrefixFromKeys(series.value))
        const response = NextResponse.json({
            success: true,
            data: stripPrefixFromKeys(series.value),
            message_title: 'Success',
            message: 'Successfully fetching records series',
        });

        return response
    } catch (err) {
        return handleApiError(err, req, 'Oops', 'Sorry, something went wrong');
    }
}
// C:\Users\ACM\Documents\rcs_nextjs\src\app\api\admin\records-series-item\as-option\[officeguid]