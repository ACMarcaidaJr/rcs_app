import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';
import { getToken } from "next-auth/jwt";


export async function GET(req: NextRequest) {
    try {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });
        const officeGuid = token?.userOffice
        const userGuid = token?.userGuid
        const data = await fetchFromDataverse({
            table: `${process.env.USER_OFFICE_TABLE}`,
            query: `$filter=crc9f_office_id/crc9f_rcs_officeid eq '${officeGuid}'` +
                `&$expand=crc9f_user_id($filter=crc9f_rcs_userid ne '${userGuid}' and crc9f_is_active eq 1)`
        })
        const users = stripPrefixFromKeys(data?.value)
            .map((item: any) => item?.user_id)
            .filter(Boolean)
            .map((user: any) => user);
        const response = NextResponse.json({
            success: true,
            data: stripPrefixFromKeys(users),
            message_title: 'Success',
            message: 'Successfully fetch the offces',
        });

        return response;
    } catch (error) {
        return handleApiError(error, req, 'Oops', 'Sorry, something went wrong');
    }
}