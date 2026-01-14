import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { getUniqueNameFromCookie } from '@/lib/get-user-unique-name-from-cookie';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';

export async function POST(req: NextRequest) {
    try {
        const req_body = await req.json();
        const user = getUniqueNameFromCookie(req)
        const user_name = user?.email
        console.log('user_name', user_name)
        if (!user_name) throw ('Sorry, something went wrong')
        const mergedBody = {
            ...req_body,
            user_name,
            status: 'draft'
        }
        const form_data = await fetchFromDataverse({
            table: `${process.env.NAP_FORM_ONE_HEADERS_TABLE}`,
            method: 'POST',
            body: prefixKeysWithCrc9f(mergedBody)
        })
        console.log('form_data', form_data)
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
        const user = getUniqueNameFromCookie(req)
        const user_name = user?.email

        const form_data = await fetchFromDataverse({
            table: `${process.env.NAP_FORM_ONE_HEADERS_TABLE}`,
            query: `$filter=crc9f_user_name eq '${user_name}'&$select=crc9f_form_name,crc9f_status,crc9f_nap_form_one_header_id,modifiedon`
        });

        const response = NextResponse.json({
            success: true,
            data: stripPrefixFromKeys(form_data?.value),
            message_title: 'Success',
            message: 'Successfully fetching forms',
        });
        return response
    } catch (err) {
        return handleApiError(err, req, 'Oops', 'Sorry, something went wrong');
    }
}