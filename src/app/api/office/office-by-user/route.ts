import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDataverseAccessToken } from '@/lib/getDataverseToken';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';
import { getUniqueNameFromCookie } from '@/lib/get-user-unique-name-from-cookie';
import { handleApiError } from '@/lib/api-error';
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });
        const userGuid = token?.userGuid;
        const office_data = await fetchFromDataverse({
            table: `${process.env.USER_OFFICE_TABLE}`,
            query: `$filter=crc9f_user_id/crc9f_rcs_userid eq '${userGuid}' and crc9f_is_active eq 1&$select=crc9f_rcs_user_officeid&$expand=crc9f_office_id($select=crc9f_name_of_office, crc9f_office_id, crc9f_rcs_officeid)`
        })
        console.log("office_data", office_data)
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