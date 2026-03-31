import { renderToStream } from '@react-pdf/renderer';
import NapFormOneDocument from '@/components/nap-form-one-document';
import { NextRequest } from 'next/server';
import { handleApiError } from '@/lib/api-error';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';

// --- Types ---
interface DataverseRow {
    is_group_value: number;
    [key: string]: any;
}

interface DataverseGroup {
    nap_form_one_group_id: string;
    rcs_nap_form_one_groupid: string;
    group_title: string;
    is_single_unit: number | boolean;
    groups_from_napformonegrow?: DataverseRow[];
}

// --- Helpers ---

/**
 * Checks the submission status to determine if the form is still editable.
 */
const getFormStatus = (header: any) => {
    const submissions = header.nap_form_one_from_submitted_task || [];
    const rawStatus = !submissions.length 
        ? 'draft' 
        : (submissions[0]?.approver_status ?? submissions[0]?.status ?? 'submitted');

    const status = rawStatus.toLowerCase();

    return {
        status,
        // Editable only if Draft or Returned
        isEditable: status === 'draft' || status === 'returned',
    };
};

/**
 * Combines user name parts into a single uppercase string.
 */
const formatFullName = (user: any) => {
    if (!user) return "";
    const { given_name, middle_name, family_name, suffix } = user;

    const middleInitial = middle_name ? `${middle_name.charAt(0)}.` : "";
    let fullName = [given_name, middleInitial, family_name].filter(Boolean).join(" ");
    if (suffix) fullName += `, ${suffix}`;

    return fullName.toUpperCase();
};

/**
 * Maps Dataverse groups and rows into the format expected by the PDF component.
 */
const transformGroups = (groups: any[] = []) => {
    return groups.map((rawGroup) => {
        const group = stripPrefixFromKeys(rawGroup) as DataverseGroup;
        const allRows = (group.groups_from_napformonegrow || []).map((row: any) =>
            stripPrefixFromKeys(row)
        );

        return {
            nap_form_one_group_id: group.nap_form_one_group_id,
            id: group.rcs_nap_form_one_groupid,
            group_title: group.group_title,
            is_editing: false,
            is_single_unit: !!group.is_single_unit,
            group_values: allRows.filter((row: any) => row.is_group_value === 1),
            items: allRows.filter((row: any) => row.is_group_value === 0),
        };
    });
};

// --- Route Handler ---

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ form_id: string }> }
) {
    try {
        const { form_id } = await params;

        // Fetch header with multiple expands combined into a single comma-separated string
        const data = await fetchFromDataverse({
            table: process.env.NAP_FORM_ONE_HEADERS_TABLE!,
            maxsize: 4000,
            query: `$filter=crc9f_rcs_nap_form_one_headerid eq ${form_id}` +
                `&$expand=crc9f_created_by($select=crc9f_user_name,crc9f_given_name,crc9f_middle_name,crc9f_suffix,crc9f_family_name,crc9f_position_title),` +
                `crc9f_nap_form_one_from_submitted_task($select=crc9f_status,crc9f_approver_status),` +
                `crc9f_headers_from_napformonegroup(` +
                `$select=crc9f_nap_form_one_group_id,crc9f_group_title,crc9f_is_single_unit;` +
                `$expand=crc9f_groups_from_napformonegrow(` +
                `$select=crc9f_nap_form_one_row_id,crc9f_is_group_value,crc9f_records_series_title_and_description,crc9f_records_medium,crc9f_frequency_of_use,crc9f_period_covered_or_inclusive_dates,crc9f_duplication,crc9f_disposition_provision,crc9f_location_of_records,crc9f_retention_period_active,crc9f_retention_period_total,crc9f_restrictions,crc9f_utility_value,crc9f_time_value,crc9f_volume,crc9f_retention_period_storage` +
                `))`
        });

        if (!data.value?.length) throw new Error('Form not found');

        // 1. Process Header
        const rawHeader = data.value[0];
        const header = stripPrefixFromKeys(rawHeader);
        console.log("header>>>>>>", header)
        // 2. Extract and format user info
        if (rawHeader.crc9f_created_by) {
            const createdByInfo = stripPrefixFromKeys(rawHeader.crc9f_created_by);
            header.prepared_by_name = formatFullName(createdByInfo);
            header.prepared_by_position = createdByInfo?.position_title || "";
        }

        // 3. Determine status and editability
        const { status, isEditable } = getFormStatus(header);

        // 4. Transform nested Groups and Items
        const groupsWithItems = transformGroups(header.headers_from_napformonegroup);

        // 5. Generate PDF Stream
        const stream = await renderToStream(
            <NapFormOneDocument
                groups={groupsWithItems}
                header={header}
            />
        );

        return new Response(stream as unknown as ReadableStream, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="nap-form-one.pdf"',
            },
        });
    } catch (error) {
        return handleApiError(error, req, 'PDF Generation Error', 'Something went wrong while generating the document.');
    }
}