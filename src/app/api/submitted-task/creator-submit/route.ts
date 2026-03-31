import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDataverseAccessToken } from '@/lib/getDataverseToken';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';
import { getUniqueNameFromCookie } from '@/lib/get-user-unique-name-from-cookie';
import { handleApiError } from '@/lib/api-error';
import { getToken } from "next-auth/jwt"
import { uploadFileToDataverse } from '@/lib/upload-file-dataverse';

export async function POST(req: NextRequest) {
    try {
        // session
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        })
        const userGuid = token?.userGuid;

        // FORM DATA
        const formData = await req.formData();
        const office_id = formData.get('office_id')
        const rcs_taskid = formData.get('rcs_taskid')
        const creator_remarks = formData.get('creator_remarks')
        const nap_form_one_id = formData.get('rcs_nap_form_one_headerid')
        const file = formData.get('nap_form_one') as File;
        const metadata = {
            "submitted_by@odata.bind": `/${process.env.USER_TABLE}(${userGuid})`,
            "office_id@odata.bind": `/${process.env.OFFICE_TABLE}(${office_id})`,
            "task_id@odata.bind": `/${process.env.TASK_TABLE}(${rcs_taskid})`,
            "nap_form_one_id@odata.bind": `/${process.env.NAP_FORM_ONE_HEADERS_TABLE}(${nap_form_one_id})`,
            creator_remarks: creator_remarks,
            status: "submitted"
        }
        // SUBMITTED_TASK_TABLE
        const submittedTask = await fetchFromDataverse({
            table: process.env.SUBMITTED_TASK_TABLE!,
            method: 'POST',
            body: prefixKeysWithCrc9f(metadata),
        });
        const recordId = submittedTask.id || submittedTask.crc9f_rcs_submitted_taskid;
        if (!recordId) {
            throw new Error("Failed to retrieve ID for the created submitted task.");
        }
        if (file && file.size > 0) {
            await uploadFileToDataverse({
                table: process.env.SUBMITTED_TASK_TABLE!,
                recordId: recordId,
                column: 'crc9f_attachment',
                file: file
            });
        }
        return NextResponse.json({
            success: true,
            message_title: 'Success',
            message: 'Submitted task and document uploaded successfully.',
        });
    } catch (error) {
        return handleApiError(error, req, 'Oops', 'Sorry, something went wrong');
    }
}