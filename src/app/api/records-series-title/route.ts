import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';
import { getToken } from "next-auth/jwt"

export async function POST(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const officeGuid = token?.userOffice;
        const userGuid = token?.userGuid;
        const req_body = await req.json();
        const role_data = await fetchFromDataverse({
            table: `${process.env.RECORD_SERIES_TITLE_TABLE}`,
            method: 'POST',
            body: prefixKeysWithCrc9f({
                ...req_body,
                "created_by@odata.bind": `/${process.env.USER_TABLE}(${userGuid})`,
                "office_id@odata.bind": `/${process.env.OFFICE_TABLE}(${officeGuid})`,
                is_active: 1
            })
        })
        const response = NextResponse.json({
            success: true,
            data: role_data,
            message_title: 'Create a New Series',
            message: 'Successfully created a series title',
        })
        return response;
    }
    catch (error) {
        return handleApiError(error, req, 'Failed to post series title to Dataverse');
    }
}

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        })

        const officeGuid = token?.userOffice
        // 1. Fetch Series with Expanded Items
        const series = await fetchFromDataverse({
            table: `${process.env.RECORD_SERIES_TITLE_TABLE}`,
            query: `$filter=crc9f_office_id/crc9f_rcs_officeid eq '${officeGuid}'&$expand=crc9f_record_series_title_to_item`
        });

        // 2. Fetch Single Units
        const singleUnit = await fetchFromDataverse({
            table: `${process.env.RECORD_SERIES_ITEM_TABLE}`,
            query: `$filter=crc9f_office_id/crc9f_rcs_officeid eq '${officeGuid}' and crc9f_record_series_id eq null`
        });

        // 3. Clean the keys
        const rawSeries = series?.value || [];
        const cleanSingleUnit = stripPrefixFromKeys(singleUnit?.value || []);

        // 4. Transform and Filter Series
        // We filter to keep only those that have items in the related table
        const cleanSeries = stripPrefixFromKeys(rawSeries)
            .filter((s: any) => {
                const items = s.record_series_title_to_item;
                return Array.isArray(items) && items.length > 0;
            });

        const response = NextResponse.json({
            success: true,
            data: {
                series: cleanSeries,
                singleUnit: cleanSingleUnit
            },
            message_title: 'Success',
            message: 'Successfully fetching records series',
        });

        return response
    } catch (err) {
        return handleApiError(err, req, 'Oops', 'Sorry, something went wrong');
    }
}