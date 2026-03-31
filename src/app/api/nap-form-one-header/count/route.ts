import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { getToken } from "next-auth/jwt"
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        })
        const userOfficeGuid = token?.userOffice

        const totalForm = await fetchFromDataverse({
            table: process.env.NAP_FORM_ONE_HEADERS_TABLE!,
            maxsize: 1,
            query: `?$filter=crc9f_office_id/crc9f_rcs_officeid eq ${userOfficeGuid}&$select=crc9f_status&$count=true`
        });
        const custodianRole = token?.roles?.find(role => role.roleName === 'custodian');
        const data = await fetchFromDataverse({
            table: process.env.TASK_TABLE!,
            query: `$filter=crc9f_role_id/crc9f_rcs_roleid eq '${custodianRole.roleGuid}' and crc9f_is_active eq 1` +
                `&$orderby=createdon desc` +
                `&$expand=crc9f_rcs_submitted_task_task_id_crc9f_rcs_task(` +
                `$filter=crc9f_office_id/crc9f_rcs_officeid eq '${userOfficeGuid}';` +
                `$orderby=createdon desc` +
                `)`
        });
        const tasks = data?.value || [];
        const counts = {
            submitted: 0,
            received: 0,
            returned: 0,
        };
        tasks.forEach((task: any) => {
            const submissions = task?.crc9f_rcs_submitted_task_task_id_crc9f_rcs_task || [];
            const approverStatus = submissions[0]?.crc9f_approver_status;

            if (submissions.length && !approverStatus) {
                counts.submitted++;
                return;
            }
            if (approverStatus === 'received') {
                counts.received++;
            } else if (approverStatus === 'returned') {
                counts.returned++;
            }
        });
        return NextResponse.json({
            success: true,
            data: { ...counts, total_forms: totalForm['@odata.count'] ?? 0, },
            message: 'Successfully fetched tasks',
        });

        // const draft = await fetchFromDataverse({
        //     table: process.env.NAP_FORM_ONE_HEADERS_TABLE!,
        //     method: 'GET',
        //     maxsize: 1,
        //     query: `?$filter=crc9f_office_id/crc9f_rcs_officeid eq ${userOffice} and crc9f_status eq 'draft'&$select=crc9f_status&$count=true`
        // });

        // const approved = await fetchFromDataverse({
        //     table: process.env.NAP_FORM_ONE_HEADERS_TABLE!,
        //     method: 'GET',
        //     maxsize: 1,
        //     query: `?$filter=crc9f_office_id/crc9f_rcs_officeid eq ${userOffice} and crc9f_status eq 'approved'&$select=crc9f_status&$count=true`
        // });
        // const submitted = await fetchFromDataverse({
        //     table: process.env.NAP_FORM_ONE_HEADERS_TABLE!,
        //     method: 'GET',
        //     maxsize: 1,
        //     query: `?$filter=crc9f_office_id/crc9f_rcs_officeid eq ${userOffice} and crc9f_status eq 'submitted'&$select=crc9f_status&$count=true`

        // });
        // return NextResponse.json({
        //     success: true,
        //     data: {
        //         total_forms: totalForm['@odata.count'] ?? 0,
        //         draft: draft['@odata.count'] ?? 0,
        //         approved: approved['@odata.count'] ?? 0,
        //         submitted: submitted['@odata.count'] ?? 0,

        //     },
        //     message_title: 'Offices Summary',
        //     message: 'Successfully fetched offices summary',
        // });

    } catch (error) {
        return handleApiError(error, req, 'Failed to fetch roles summary');
    }
}