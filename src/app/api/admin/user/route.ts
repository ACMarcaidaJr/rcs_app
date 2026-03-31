import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';

export async function POST(req: NextRequest) {
    try {
        const req_body = await req.json();

        const user_data = await fetchFromDataverse({
            table: `${process.env.USER_TABLE}`,
            method: 'POST',
            body: prefixKeysWithCrc9f({ ...req_body, is_active: 1 })
        })

        const response = NextResponse.json({
            success: true,
            data: user_data,
            message_title: 'Create a New User',
            message: 'Successfully created a new user',
        })
        return response;
    }
    catch (error) {
        return handleApiError(error, req, 'Failed to post user to Dataverse');
    }
}


export async function GET(req: NextRequest) {
    try {
        const nextLink = req.nextUrl.searchParams.get('nextLink');
        let query;

        if (nextLink) {
            query = nextLink.substring(nextLink.indexOf('?'));
        } else {
            query = `?$count=true` +
                `&$select=crc9f_user_name,crc9f_given_name,crc9f_family_name,crc9f_suffix, crc9f_is_active,createdon,crc9f_user_id,crc9f_rcs_userid`;
        }

        const user_data = await fetchFromDataverse({
            table: process.env.USER_TABLE!,
            method: 'GET',
            query,
        });

        return NextResponse.json({
            success: true,
            data: stripPrefixFromKeys(user_data.value),
            total: user_data['@odata.count'] ?? null,
            nextLink: user_data['@odata.nextLink'] ?? null,
            hasNextPage: !!user_data['@odata.nextLink'],
        });

    } catch (error) {
        return handleApiError(error, req, 'Failed to fetch users from Dataverse');
    }
}