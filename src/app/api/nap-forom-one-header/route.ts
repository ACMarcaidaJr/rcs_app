import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { getUniqueNameFromCookie } from '@/lib/get-user-unique-name-from-cookie';

export async function POST(req: NextRequest) {
    try {

        const req_body = await req.json();
        const user = getUniqueNameFromCookie(req)
        const user_name = user?.email
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
        const req_body = await req.json();
        const form_id = req_body.id;
        const user_account = getUniqueNameFromCookie(req)
        if (!user_account) throw ('Sorry, something went wrong')

        const form_data = await fetchFromDataverse({
            table: `${process.env.NAP_FORM_ONE_HEADERS_TABLE}`,
            query: `$filter=crc9f_user_name eq '${user_account?.email}'`
        })



    } catch (err) {
        return handleApiError(err, req, 'Oops', 'Sorry, something went wrong');
    }
}