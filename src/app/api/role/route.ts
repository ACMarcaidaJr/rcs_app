
import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { getUniqueNameFromCookie } from '@/lib/get-user-unique-name-from-cookie';
import { getDataverseAccessToken } from '@/lib/getDataverseToken';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { uploadFileToDataverse } from '@/lib/upload-file-dataverse';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';

export async function GET(req: NextRequest) {

    try {
        const data = await fetchFromDataverse({
            table: `${process.env.ROLE_TABLE}`,
            query: `$filter=crc9f_is_active eq '1' &$select=crc9f_role_name, crc9f_role_id,crc9f_is_active,crc9f_description`
        });
        return NextResponse.json({
            success: true,
            data: stripPrefixFromKeys(data?.value),
            message_title: 'Success',
            message: 'Successfully fetching Roles',
        });
    } catch (error) {
        return handleApiError(error, req, 'Oops', 'Sorry, something went wrong');
    }

}