import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest, { params }: { params: Promise<{ byrole: string }> }) {
    try {
        const { byrole } = await params;
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        const custodianRole = token?.roles?.find(role => role.roleName === byrole);
        const userOfficeGuid = token?.userOffice
        const data = await fetchFromDataverse({
            table: process.env.TASK_TABLE!,
            query: `$filter=crc9f_role_id/crc9f_rcs_roleid eq '${custodianRole.roleGuid}' and crc9f_is_active eq 1` +
                `&$orderby=createdon asc` +
                `&$expand=crc9f_rcs_submitted_task_task_id_crc9f_rcs_task(` +
                `$filter=crc9f_office_id/crc9f_rcs_officeid eq '${userOfficeGuid}';` +
                `$orderby=createdon asc` +
                `)`
        });

        const historyTasks = data?.value?.filter((task: any) => {
            const submissions = task?.crc9f_rcs_submitted_task_task_id_crc9f_rcs_task || [];
            if (submissions.length === 0) return false;
            const latest = submissions[submissions.length - 1];
            const isReturned = latest?.crc9f_approver_status === 'returned';
            return !isReturned;
        });
        console.log('TASK HISTORY', historyTasks)
        return NextResponse.json({
            success: true,
            data: stripPrefixFromKeys(historyTasks),
            message: 'Successfully fetched tasks',
        });


    } catch (err) {
        return handleApiError(err, req, 'Oops', 'Sorry, something went wrong');
    }
}