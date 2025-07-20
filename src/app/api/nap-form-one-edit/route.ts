import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { getUniqueNameFromCookie } from '@/lib/get-user-unique-name-from-cookie';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';
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