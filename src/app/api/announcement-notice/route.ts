// /api/announcement-notice

import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { getUniqueNameFromCookie } from '@/lib/get-user-unique-name-from-cookie';
import { getDataverseAccessToken } from '@/lib/getDataverseToken';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { uploadFileToDataverse } from '@/lib/upload-file-dataverse';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';

export async function POST(req: NextRequest) {
    try {
        const user = getUniqueNameFromCookie(req);
          const user_name = user?.email;
        const rcs_userid = user?.rcs_userid
        const formData = await req.formData();
        const notice_title = formData.get('notice_title')
        const notice_description = formData.get('notice_description')
        const year_covered = formData.get('year_covered')
        const deadline_of_submission = formData.get('deadline_of_submission')
        const supporting_document = formData.get('supporting_document') as File
        const rcs_roleid = formData.get('rcs_roleid')
        const metadata = {
            notice_title: notice_title,
            notice_description: notice_description,
            year_covered: year_covered,
            deadline_of_submission: deadline_of_submission,
            "user_id@odata.bind": `/${process.env.USER_TABLE}(${rcs_userid})`,
            "role_id@odata.bind": `/${process.env.ROLE_TABLE}(${rcs_roleid})`
        };
        const created = await fetchFromDataverse({
            table: process.env.NAP_FORM_ONE_COMPLIANCE_NOTICE!,
            method: 'POST',
            body: prefixKeysWithCrc9f(metadata),
        });
        const recordId = created.crc9f_rcs_announcement_noticeid;
        console.log('created', created)
        await uploadFileToDataverse({
            table: process.env.NAP_FORM_ONE_COMPLIANCE_NOTICE!,
            recordId,
            column: 'crc9f_supporting_document',
            file: supporting_document
        });

        return NextResponse.json({
            success: true,
            message: 'Submit successfully',
        });

    } catch (error) {
        return handleApiError(error, req, 'Oops', 'Sorry, something went wrong');
    }
}

export async function GET(req: NextRequest) {
    try {
        const user_account = getUniqueNameFromCookie(req)
        const notices = await fetchFromDataverse({
            table: process.env.NAP_FORM_ONE_COMPLIANCE_NOTICE!,
            query: `$filter=_crc9f_user_id_value eq ${user_account?.rcs_userid}`
        })
        const response = NextResponse.json({
            success: true,
            data: stripPrefixFromKeys(notices.value),
            message_title: 'Success',
            message: 'Successfully fetch the offces',
        });
        return response;
    } catch (error) {
        return handleApiError(error, req, 'Oops', 'Sorry, something went wrong');
    }
}