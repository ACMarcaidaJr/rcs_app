import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';
import { getToken } from "next-auth/jwt"


export async function GET(req: NextRequest) {
    try {
        const nextLink = req.nextUrl.searchParams.get('nextLink');
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });
        const officeGuid = token?.userOffice;
        let query;
        if (nextLink) {
            query = nextLink.substring(nextLink.indexOf('?'));
        } else {
            query = `$filter=crc9f_office_id/crc9f_rcs_officeid eq '${officeGuid}'` +
                `&$expand=` +
                `crc9f_record_series_id,` +
                `crc9f_record_series_item_in_nap_rows(` +
                `$expand=crc9f_nap_form_one_group_id(` +
                `$expand=crc9f_nap_form_one_header_id(` +
                `$expand=crc9f_nap_form_one_from_submitted_task($filter=crc9f_approver_status eq 'received')` +
                `)` +
                `)` +
                `)`
        }

        const currentYear = new Date().getFullYear();

        const data = await fetchFromDataverse({
            table: process.env.RECORD_SERIES_ITEM_TABLE!,
            method: 'GET',
            maxsize: 15,
            query
        });
        const processDisposalData = (rawItems: any[]) => {
            return rawItems.map(item => {
                // 1. Filter for valid submissions 
                // We safely check if the expanded 'received' tasks exist
                const validSubmissions = (item.record_series_item_in_nap_rows || []).filter((row: any) => {
                    const tasks = row.nap_form_one_group_id?.nap_form_one_header_id?.nap_form_one_from_submitted_task;
                    return Array.isArray(tasks) && tasks.length > 0;
                });

                // 2. Setup accumulation lists
                const allDueYears: number[] = [];
                const allOverdueYears: number[] = [];
                const yearsFound: number[] = [];
                const totalVolumeList: string[] = [];

                validSubmissions.forEach((row: any) => {
                    const isRowPermanent = row.time_value === 'P';
                    const active = parseInt(row.retention_period_active) || 0;
                    const storage = parseInt(row.retention_period_storage) || 0;
                    const startYear = parseInt(row.date_period_from);
                    const endYear = parseInt(row.date_period_to);

                    if (row.volume) totalVolumeList.push(row.volume);
                    if (!isNaN(startYear)) yearsFound.push(startYear);
                    if (!isNaN(endYear)) yearsFound.push(endYear);

                    if (!isRowPermanent && !isNaN(startYear) && !isNaN(endYear)) {
                        for (let y = startYear; y <= endYear; y++) {
                            const disposalYear = y + active + storage + 1;
                            if (disposalYear === currentYear) {
                                allDueYears.push(y);
                            } else if (disposalYear < currentYear) {
                                allOverdueYears.push(y);
                            }
                        }
                    }
                });

                // 3. Format the data for the UI
                const accumulatedRange = yearsFound.length > 0
                    ? `${Math.min(...yearsFound)} - ${Math.max(...yearsFound)}`
                    : "No NAP submissions";

                const latestYear = yearsFound.length > 0 ? Math.max(...yearsFound) : null;

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
                            if (i < sorted.length) { start = sorted[i]; end = sorted[i]; }
                        }
                    }
                    return result.join(", ");
                };

                // 4. Get latest submission with fallback to null
                const latestSubmission = validSubmissions.length > 0
                    ? [...validSubmissions].sort((a: any, b: any) => parseInt(b.date_period_to) - parseInt(a.date_period_to))[0]
                    : null;

                // 5. Return the final structure
                return {
                    ...item,            // Start with base item (e.g., Appointments)
                    // ...(latestSubmission || {}), // Only overwrite with submission data if it exists
                    accumulatedRange,
                    totalVolumeList,
                    volume: totalVolumeList.join(", "),
                    latestYear,
                    // Check both item and submissions for Permanent status
                    isPermanent: item.time_value === 'P' || validSubmissions.some((r: any) => r.time_value === 'P'),
                    isDueThisYear: formatYearRange(allDueYears),
                    overdue: formatYearRange(allOverdueYears),
                    // PRIORITY: Always prioritize the Series Item Title from the parent record
                    records_series_title_and_description: item.series_item_title || latestSubmission?.records_series_title_and_description || "Untitled Series"
                };
            });
        };
        return NextResponse.json({
            success: true,
            data: processDisposalData(stripPrefixFromKeys(data?.value)),
            total: data['@odata.count'] ?? null,
            nextLink: data['@odata.nextLink'] ?? null,
            hasNextPage: !!data['@odata.nextLink'],
            message_title: 'Success',
            message: 'Successfully fetching records series',
        });
    } catch (err) {
        return handleApiError(err, req, 'Oops', 'Sorry, something went wrong');
    }
}