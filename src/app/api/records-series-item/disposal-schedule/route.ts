import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';
import { getToken } from "next-auth/jwt"


// NOT BEING USED BECAUSE MOVED TO /route.ts

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });
        const officeGuid = token?.userOffice;
        const currentYear = 2026; // Setting explicitly for your 2026 context

        const data = await fetchFromDataverse({
            table: `${process.env.RECORD_SERIES_ITEM_TABLE}`,
            query: `$filter=crc9f_office_id/crc9f_rcs_officeid eq '${officeGuid}'` +
                `&$expand=crc9f_record_series_item_in_nap_rows($expand=crc9f_nap_form_one_group_id($expand=crc9f_nap_form_one_header_id($expand=crc9f_nap_form_one_from_submitted_task($filter=crc9f_approver_status eq 'received'))))`
        });

        const processDisposalData = (rawItems: any[]) => {
            return rawItems.flatMap(item => {
                const validSubmissions = (item.record_series_item_in_nap_rows || []).filter((row: any) =>
                    row.nap_form_one_group_id?.nap_form_one_header_id?.nap_form_one_from_submitted_task?.some(
                        (task: any) => task.approver_status === 'received'
                    )
                );

                const yearsFound = validSubmissions.flatMap((r: any) => [
                    parseInt(r.date_period_from),
                    parseInt(r.date_period_to)
                ]).filter((n: any) => !isNaN(n));

                const accumulatedRange = yearsFound.length > 0
                    ? `${Math.min(...yearsFound)} - ${Math.max(...yearsFound)}`
                    : "No valid submissions";

                const totalVolumeList = validSubmissions.map((r: any) => r.volume).filter(Boolean);
                const latestYear = yearsFound.length > 0 ? Math.max(...yearsFound) : null;

                return validSubmissions.map((row: any) => {
                    const isPermanent = row.time_value === 'P';
                    const active = parseInt(row.retention_period_active) || 0;
                    const storage = parseInt(row.retention_period_storage) || 0;
                    const startYear = parseInt(row.date_period_from);
                    const endYear = parseInt(row.date_period_to);

                    const dueYears: number[] = [];
                    const overdueYears: number[] = [];

                    if (!isPermanent && !isNaN(startYear) && !isNaN(endYear)) {
                        // Loop through every year in the inclusive range
                        for (let y = startYear; y <= endYear; y++) {
                            const disposalYear = y + active + storage;
                            if (disposalYear === currentYear) {
                                dueYears.push(y);
                            } else if (disposalYear < currentYear) {
                                overdueYears.push(y);
                            }
                        }
                    }

                    // Utility to format arrays into "2020 - 2022, 2024" strings
                    const formatYearRange = (yearArray: number[]) => {
                        if (yearArray.length === 0) return "";
                        const sorted = [...new Set(yearArray)].sort((a, b) => a - b);
                        const result = [];
                        let start = sorted[0];
                        let end = sorted[0];

                        for (let i = 1; i <= sorted.length; i++) {
                            if (i < sorted.length && sorted[i] === end + 1) {
                                end = sorted[i];
                            } else {
                                result.push(start === end ? `${start}` : `${start}-${end}`);
                                if (i < sorted.length) {
                                    start = sorted[i];
                                    end = sorted[i];
                                }
                            }
                        }
                        return result.join(", ");
                    };

                    return {
                        accumulatedRange,
                        totalVolumeList,
                        latestYear,
                        isPermanent,
                        isDueThisYear: formatYearRange(dueYears),
                        overdue: formatYearRange(overdueYears),
                        ...row
                    };
                });
            });
        };

        return NextResponse.json({
            success: true,
            data: processDisposalData(stripPrefixFromKeys(data?.value)),
            message_title: 'Success',
            message: 'Successfully fetching records series',
        });
    } catch (err) {
        return handleApiError(err, req, 'Oops', 'Sorry, something went wrong');
    }
}