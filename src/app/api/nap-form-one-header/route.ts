import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { getUniqueNameFromCookie } from '@/lib/get-user-unique-name-from-cookie';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';
import { getUserIds } from '@/lib/getUserIds';
import { getToken } from "next-auth/jwt"

export async function POST(req: NextRequest) {
    try {
        const req_body = await req.json();
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        })
        const userGuid = token?.userGuid;
        const userOfficeGuid = token?.userOffice
        if (!userGuid) throw ('Sorry, something went wrong')
        const mergedBody = {
            ...req_body,
            "created_by@odata.bind": `/${process.env.USER_TABLE}(${userGuid})`,
            "office_id@odata.bind": `/${process.env.OFFICE_TABLE}(${userOfficeGuid})`,
            status: 'draft'
        }
        const form_data = await fetchFromDataverse({
            table: `${process.env.NAP_FORM_ONE_HEADERS_TABLE}`,
            method: 'POST',
            body: prefixKeysWithCrc9f(mergedBody)
        })
        const response = NextResponse.json({
            success: true,
            data: form_data,
            message_title: 'Create a new form',
            message: 'Successfully created a form',
        });

        return response
    } catch (err) {
        return handleApiError(err, req, 'Oops', 'Sorry, something went wrong');

    }
}

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        })
        const userGuid = token?.userGuid
        const data = await fetchFromDataverse({
            table: `${process.env.NAP_FORM_ONE_HEADERS_TABLE}`,
            query: `$filter=crc9f_created_by/crc9f_rcs_userid eq '${userGuid}'` +
                `&$expand=crc9f_nap_form_one_from_submitted_task($orderby=createdon desc)`
        });
        const response = NextResponse.json({
            success: true,
            data: stripPrefixFromKeys(data?.value),
            message_title: 'Success',
            message: 'Successfully fetching forms',
        });
        return response
    } catch (err) {
        return handleApiError(err, req, 'Oops', 'Sorry, something went wrong');
    }
}