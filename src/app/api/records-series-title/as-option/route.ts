import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';
import { getToken } from "next-auth/jwt"



export async function GET(req: NextRequest) {
    try {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        })
        const officeGuid = token?.userOffice
        const series = await fetchFromDataverse({
            table: `${process.env.RECORD_SERIES_TITLE_TABLE}`,
            query: `$filter=crc9f_office_id/crc9f_rcs_officeid eq '${officeGuid}'&$select=crc9f_rcs_record_series_titleid, crc9f_record_series_title`
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