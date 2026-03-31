import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDataverseAccessToken } from '@/lib/getDataverseToken';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';
import { getUniqueNameFromCookie } from '@/lib/get-user-unique-name-from-cookie';
import { handleApiError } from '@/lib/api-error';

export async function POST(req: NextRequest) {
    try {
        const req_body = await req.json();
        const {parent_id, ...fields} = req_body;
        const office_data = await fetchFromDataverse({
            table: `${process.env.OFFICES_TABLE}`,
            method: 'POST',
            body: {
                ...prefixKeysWithCrc9f(fields),
                "crc9f_parent_id@odata.bind": `/${process.env.USER_TABLE}(${parent_id})`
            }
        })
        const response = NextResponse.json({
            success: true,
            data: office_data,
            message_title: 'Add account office',
            message: 'Successfully updated account\'s info',
        });
        return response
    } catch (error) {
        return handleApiError(error, req, 'Oops', 'Sorry, something went wrong');
    }
}

export async function GET(req: NextRequest) {
    try {
        const user_account = getUniqueNameFromCookie(req)
        const office_data = await fetchFromDataverse({
            table: `${process.env.OFFICES_TABLE}`,
            query: `$filter=crc9f_user_name eq '${user_account?.email}'`
        })

        const response = NextResponse.json({
            success: true,
            data: stripPrefixFromKeys(office_data.value),
            message_title: 'Success',
            message: 'Successfully fetch the offces',
        });
        return response;
    } catch (error) {
        return handleApiError(error, req, 'Oops', 'Sorry, something went wrong');
    }
}