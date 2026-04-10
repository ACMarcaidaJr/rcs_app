import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';
import { getToken } from "next-auth/jwt";
import { calculateRecordStatus } from '@/lib/inclusive-dates-status';

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const officeGuid = token?.userOffice;

        const data = await fetchFromDataverse({
            table: `${process.env.SUBMITTED_TASK_TABLE}`,
            query: `$filter=crc9f_office_id/crc9f_rcs_officeid eq '${officeGuid}' and crc9f_approver_status eq 'received'` +
                `&$orderby=createdon desc` + 
                `&$expand=crc9f_nap_form_one_id($expand=crc9f_headers_from_napformonegroup($expand=crc9f_groups_from_napformonegrow))`
        });

        const processedRowIds = new Set();
        
        let total_records = 0;
        let overdue = 0;
        let partial_disposal = 0; 
        let due_this_year = 0;
        let permanent = 0;

        const tasks = stripPrefixFromKeys(data.value);

        tasks.forEach((task: any) => {
            const headers = task.nap_form_one_id?.headers_from_napformonegroup || [];

            headers.forEach((header: any) => {
                const rows = header.groups_from_napformonegrow || [];

                rows.forEach((row: any) => {
                    // --- THE FIX ---
                    // 1. Only count individual items (is_group_value === 0).
                    // This prevents counting the "Group Header" as a separate record.
                    if (row.is_group_value !== 0) return;

                    // 2. Prevent double-counting the same physical record across multiple tasks
                    const rowId = row.rcs_nap_form_one_rowid;
                    if (!rowId || processedRowIds.has(rowId)) return;
                    processedRowIds.add(rowId);

                    const { status } = calculateRecordStatus(
                        row.retention_period_total,
                        row.date_period_from,
                        row.date_period_to
                    );

                    total_records++;

                    switch (status) {
                        case 'permanent':
                            permanent++;
                            break;
                        case 'overdue':
                            overdue++;
                            break;
                        case 'partial':
                            partial_disposal++;
                            break;
                        case 'due':
                            due_this_year++;
                            break;
                    }
                });
            });
        });

        return NextResponse.json({
            success: true,
            data: {
                total_records, 
                overdue,
                partial_disposal, 
                due_this_year,
                permanent
            }
        });

    } catch (error) {
        return handleApiError(error, req, 'Counting Error', 'Failed to calculate official record totals.');
    }
}