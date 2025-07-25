// app/api/nap-form-one/[form_id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';

export async function GET(req: NextRequest, { params }: { params: { form_id: string } }) {
    try {
        const formId = await params.form_id



        const groupData = await fetchFromDataverse({
            table: `${process.env.NAP_FORM_ONE_GROUPS_TABLE}`,
            query: `$filter=crc9f_nap_form_one_header_id eq ${formId}`
        });

        const groupIds = groupData.value
            .map((item: any) => item.crc9f_nap_form_one_group_id)
            .filter(Boolean);

        const groupFilter = groupIds
            .map((id: string) => `crc9f_nap_form_one_group_id eq '${id}'`)
            .join(' or ');

        let groupsWithItems = { value: [] }
        if (groupFilter?.length) {
            const itemData = await fetchFromDataverse({
                table: `${process.env.NAP_FORM_ONE_ROWS_TABLE}`,
                query: `$filter=${groupFilter}
                &$select=crc9f_records_series_title_and_description, 
                            crc9f_is_group_value,
                            crc9f_records_medium,
                            crc9f_frequency_of_use,
                            crc9f_period_covered_or_inclusive_dates,
                            crc9f_duplication,
                            crc9f_disposition_provision,
                            crc9f_location_of_records,
                            crc9f_retention_period_active,
                            crc9f_nap_form_one_group_id,
                            crc9f_retention_period_total,
                            crc9f_restrictions,
                            crc9f_nap_form_one_header_id,
                            crc9f_nap_form_one_row_id,
                            crc9f_utility_value,
                            crc9f_time_value,
                            crc9f_volume,
                            crc9f_retention_period_storage`
            });
            // console.log('groupData',groupData)
            // // Transform the data
            groupsWithItems = groupData.value.map((group: any) => {
                const allRows = itemData.value || [];
                // const { crc9f_nap_form_one_group_id, crc9f_group_title, crc9f_id, crc9f_is_single_unit, crc9f_is_editing = false } = group;
                return {
                    nap_form_one_group_id: group.crc9f_nap_form_one_group_id,
                    id: group.crc9f_id,
                    group_title: group.crc9f_group_title || '',
                    is_editing: false,
                    is_single_unit: !!group.crc9f_is_single_unit,
                    group_values: stripPrefixFromKeys(allRows.filter((row: any) => row.crc9f_is_group_value === 1 && row.crc9f_nap_form_one_group_id === group.crc9f_nap_form_one_group_id)),
                    items: stripPrefixFromKeys(allRows.filter((row: any) => row.crc9f_is_group_value === 0 && row.crc9f_nap_form_one_group_id === group.crc9f_nap_form_one_group_id)),
                };
            });
        }


        return NextResponse.json({ success: true, groups: groupsWithItems });
    } catch (error) {
        console.error('Fetch groups error:', error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
