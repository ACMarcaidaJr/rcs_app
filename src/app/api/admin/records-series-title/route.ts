import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';
import { getToken } from "next-auth/jwt"

export async function POST(req: NextRequest) {
    try {
        const { office_guid, ...req_body } = await req.json();
        const data = await fetchFromDataverse({
            table: `${process.env.RECORD_SERIES_TITLE_TABLE}`,
            method: 'POST',
            body: prefixKeysWithCrc9f({
                ...req_body,
                "office_id@odata.bind": `/${process.env.OFFICE_TABLE}(${office_guid})`,
                is_active: 1
            })
        })
        const response = NextResponse.json({
            success: true,
            data: data,
            message_title: 'Create a New Series',
            message: 'Successfully created a series title',
        })
        return response;
    }
    catch (error) {
        return handleApiError(error, req, 'Failed to post series title to Dataverse');
    }
}
