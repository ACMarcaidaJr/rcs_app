import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';

export async function POST(req: NextRequest) {
    try {
        const req_body = await req.json();

        const role_data = await fetchFromDataverse({
            table: `${process.env.ROLE_TABLE}`,
            method: 'POST',
            body: prefixKeysWithCrc9f({ ...req_body, is_active: '1' })
        })

        const response = NextResponse.json({
            success: true,
            data: role_data,
            message_title: 'Create a New Role',
            message: 'Successfully created a new role',
        })
        return response;
    }
    catch (error) {
        return handleApiError(error, req, 'Failed to post role to Dataverse');
    }
}


export async function GET(req: NextRequest) {
    try {
        const nextLink = req.nextUrl.searchParams.get('nextLink');

        let query;

        if (nextLink) {
            query = nextLink.substring(nextLink.indexOf('?'));
        } else {
            query = `?$count=true&$select=crc9f_role_name,crc9f_description,crc9f_is_active,createdon,crc9f_role_id,crc9f_rcs_roleid`;
        }
        const role_data = await fetchFromDataverse({
            table: process.env.ROLE_TABLE!,
            method: 'GET',
            query,
        });
        return NextResponse.json({
            success: true,
            data: stripPrefixFromKeys(role_data.value),
            total: role_data['@odata.count'] ?? null,
            nextLink: role_data['@odata.nextLink'] ?? null,
            hasNextPage: !!role_data['@odata.nextLink'],
        });

    } catch (error) {
        return handleApiError(error, req, 'Failed to fetch roles from Dataverse');
    }
}