
import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { getUniqueNameFromCookie } from '@/lib/get-user-unique-name-from-cookie';
import { getDataverseAccessToken } from '@/lib/getDataverseToken';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { uploadFileToDataverse } from '@/lib/upload-file-dataverse';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';

// SUBMITTED_NAP_FORM_ONE_TABLE=crc9f_rcs_submitted_nap_form_ones
export async function GET(req: NextRequest) {
    try {
        const user_account = getUniqueNameFromCookie(req)
        const data = await fetchFromDataverse({
            table: `${process.env.NAP_FORM_ONE_COMPLIANCE_NOTICE}`,
            query: `$filter=crc9f_created_by eq '${user_account?.email}'`
        })

        const response = NextResponse.json({
            success: true,
            data: stripPrefixFromKeys(data.value),
            message_title: 'Success',
            message: 'Successfully fetch the offces',
        });
        return response;
    } catch (error) {
        return handleApiError(error, req, 'Oops', 'Sorry, something went wrong');
    }
}