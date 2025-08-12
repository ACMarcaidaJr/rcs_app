import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDataverseAccessToken } from '@/lib/getDataverseToken';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';
import { getUniqueNameFromCookie } from '@/lib/get-user-unique-name-from-cookie';
import { handleApiError } from '@/lib/api-error';

const DATAVERSE_URL = process.env.NEXT_PUBLIC_DATAVERSE_URL;
export async function POST(req: NextRequest) {
    try {
        const req_body = await req.json();
        const user = getUniqueNameFromCookie(req)
        const user_name = user?.email
        if (!user) throw "Access rights denied, missing user information"
        const mergedBody = {
            ...req_body,
            user_name,
        }
        const office_data = await fetchFromDataverse({
            table: `${process.env.OFFICES_TABLE}`,
            method: 'POST',
            body: prefixKeysWithCrc9f(mergedBody)
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