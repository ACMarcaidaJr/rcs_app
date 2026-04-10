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
        const { rcs_records_seriesid, utility_value, is_nap_grds, ...req_body } = await req.json();
        const payload: any = {
            ...req_body,
            is_nap_grds: is_nap_grds ? 1 : 0,
            utility_value: JSON.stringify(utility_value),
            is_active: 1
        };
        if (rcs_records_seriesid) {
            payload["record_series_id@odata.bind"] = `/${process.env.RECORD_SERIES_TITLE_TABLE}(${rcs_records_seriesid})`;
        }
        payload["created_by@odata.bind"] = `/${process.env.USER_TABLE}(${userGuid})`;
        payload["office_id@odata.bind"] = `/${process.env.OFFICE_TABLE}(${officeGuid})`;

        const role_data = await fetchFromDataverse({
            table: `${process.env.RECORD_SERIES_ITEM_TABLE}`,
            method: 'POST',
            body: prefixKeysWithCrc9f(payload)
        });
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
        const userGuid = token?.userGuid
        const officeGuid = token?.userOffice
        const data = await fetchFromDataverse({
            table: `${process.env.RECORD_SERIES_ITEM_TABLE}`,
            query: `$filter=crc9f_office_id/crc9f_rcs_officeid eq '${officeGuid}'`
        });
        const response = NextResponse.json({
            success: true,
            data: stripPrefixFromKeys(data?.value),
            message_title: 'Success',
            message: 'Successfully fetching records series',
        });
        return response
    } catch (err) {
        return handleApiError(err, req, 'Oops', 'Sorry, something went wrong');
    }
}