// app/api/nap-form-one/[form_id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';

export async function GET(req: NextRequest, { params }: { params: Promise<{ form_id: string }> }) {
    try {
        const { form_id } = await params;
        const data = await fetchFromDataverse({
            table: `${process.env.NAP_FORM_ONE_GROUPS_TABLE}`,
            query: `$filter=crc9f_nap_form_one_header_id/crc9f_rcs_nap_form_one_headerid eq '${form_id}'` +
                `&$expand=crc9f_groups_from_napformonegrow($select=` +
                `crc9f_records_series_title_and_description,crc9f_is_group_value,` +
                `crc9f_records_medium,crc9f_frequency_of_use,crc9f_date_period_from,` +
                `crc9f_date_period_to,crc9f_duplication,crc9f_disposition_provision,` +
                `crc9f_location_of_records,crc9f_retention_period_active,` +
                `crc9f_retention_period_total,crc9f_restrictions,crc9f_nap_form_one_row_id,` +
                `crc9f_utility_value,crc9f_time_value,crc9f_volume,crc9f_retention_period_storage,crc9f_is_full_date,` +
                `_crc9f_record_series_item_id_value)` 
        });
        console.log("data", JSON.stringify(data.value))
        const groupitems = stripPrefixFromKeys(data).value.map((group: any) => {
            const allRows = group.groups_from_napformonegrow;
            return {
                nap_form_one_group_id: group.nap_form_one_group_id,
                rcs_group_id: group.rcs_group_id_value, 
                id: Number(group.id),
                group_title: group.group_title || '',
                is_editing: !!group.is_editing,
                is_single_unit: !!group.is_single_unit,
                items: allRows.map((row: any) => ({
                    ...stripPrefixFromKeys(row),
                    record_series_item_id: row.record_series_item_id_value || row._crc9f_record_series_item_id_value
                }))
            }
        });
        console.log("groupitems", JSON.stringify(groupitems))
        return NextResponse.json({ success: true, groups: groupitems });
    } catch (error) {
        console.error('Fetch groups error:', error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}