import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { getUniqueNameFromCookie } from '@/lib/get-user-unique-name-from-cookie';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';
import { getUserIds } from '@/lib/getUserIds';
import { getToken } from "next-auth/jwt"

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const officeGuid = token?.userOffice;
        // can be fetch by office or individual submission.
        const data = await fetchFromDataverse({
            table: `${process.env.SUBMITTED_TASK_TABLE}`,
            query: `$filter=crc9f_office_id/crc9f_rcs_officeid eq '${officeGuid}' and crc9f_approver_status eq 'received'` +
                `&$orderby=createdon desc` +
                `&$expand=crc9f_nap_form_one_id(` +
                `$expand=crc9f_headers_from_napformonegroup(` +
                `$expand=crc9f_groups_from_napformonegrow($filter=crc9f_is_group_value eq 0)` +
                `)` +
                `)`
        });

        const rawTasks = stripPrefixFromKeys(data.value);

        const seenHeaders = new Set();
        const uniqueLatestTasks = rawTasks.filter((task: any) => {
            const headerId = task._nap_form_one_id_value;
            if (seenHeaders.has(headerId)) return false;
            seenHeaders.add(headerId);
            return true;
        });

        // 3. Flatten the Rows (Correctly drilling into the expanded parent)
        // 3. Flatten the Rows directly from rawTasks
        const allDisposalRows = rawTasks.flatMap((task: any) => {
            const header = task.nap_form_one_id;
            if (!header) return [];

            return (header.headers_from_napformonegroup || []).flatMap((group: any) =>
                (group.groups_from_napformonegrow || []).map((row: any) => ({
                    ...row,
                    parent_form_name: header.form_name,
                    parent_headerid: header.rcs_nap_form_one_headerid,
                    submission_task_id: task.rcs_submitted_taskid, // Distinguish between submissions
                    received_date: task.createdon
                }))
            );
        });

        // for my front-end to show the group title  in my table.
        // example: group title sample name
        // - sample rows/subunit of records
        // - sample 2
        const allGroupsWithRows = uniqueLatestTasks.flatMap((task: any) => {
            const header = task.nap_form_one_id;
            if (!header) return [];
            return (header.headers_from_napformonegroup || []).map((group: any) => ({
                group_id: group.nap_form_one_group_id,
                group_title: group.group_title || "General Records",
                parent_form: header.form_name,
                rows: group.groups_from_napformonegrow || []
            }));
        });
        console.log("allDisposalRows", allDisposalRows)
        return NextResponse.json({
            success: true,
            data: allDisposalRows,
            message_title: 'Success',
            message: 'Successfully fetching disposal rows',
        });

    } catch (error) {
        return handleApiError(error, req, 'Data Fetching Error', 'Failed to retrieve disposal rows.');
    }
}