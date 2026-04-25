import { NextRequest, NextResponse } from "next/server";
import { fetchFromDataverse } from "@/lib/fetchFromDataverse";
import { executeBatchSafe, executeBatchMulti, BatchOperation } from "@/lib/dataverse-batch";
import { prefixKeysWithCrc9f } from "@/lib/prefixKey";

/**
 * POST /api/nap-form-one-data
 * Handles bulk deletion and creation of NAP Form One groups and rows in Dataverse
 */
export async function POST(req: NextRequest) {
    try {
        const { groups, form_id } = await req.json();
        console.log("groups", JSON.stringify(groups))
        // =========================
        // STEP 1: FETCH EXISTING GROUPS & ROWS
        // =========================
        const existingGroups = await fetchFromDataverse({
            table: process.env.NAP_FORM_ONE_GROUPS_TABLE!,
            query: `$filter=crc9f_nap_form_one_header_id/crc9f_rcs_nap_form_one_headerid eq '${form_id}'&$select=crc9f_rcs_nap_form_one_groupid`
        });

        const groupGuids = existingGroups.value
            .map((g: any) => g.crc9f_rcs_nap_form_one_groupid)
            .filter(Boolean);

        // =========================
        // STEP 2: DELETE EXISTING GROUPS (Cascade handles rows)
        // =========================
        if (groupGuids.length > 0) {
            await executeBatchSafe(
                groupGuids.map((id: any) => ({
                    method: "DELETE",
                    table: process.env.NAP_FORM_ONE_GROUPS_TABLE!,
                    id
                })),
                100
            );
        }

        // =========================
        // STEP 3: PREPARE NEW DATA
        // =========================
        const groupedOps: BatchOperation[][] = [];
        let groupId = 1
        for (const group of groups) {
            const groupOps: BatchOperation[] = [];

            // Whitelist Group fields
            const cleanGroupInput = {
                group_title: group.group_title || "",
                is_editing: group.is_editing ? 1 : 0,
                is_single_unit: group.is_single_unit ? 1 : 0,
                id: group.id ? String(group.id) : `${groupId}`
            };
            groupId++
            const groupPayload: any = prefixKeysWithCrc9f(cleanGroupInput);

            // FIX: Added 'crc9f_' prefix to the lookup key
            groupPayload["crc9f_nap_form_one_header_id@odata.bind"] =
                `/${process.env.NAP_FORM_ONE_HEADERS_TABLE}(${form_id})`;

            groupOps.push({
                method: "POST",
                table: process.env.NAP_FORM_ONE_GROUPS_TABLE!,
                body: groupPayload,
                contentId: 1
            });

            for (const row of group.items) {
                // 1. Double check your incoming property name. 
                // Is it row.record_series_item_id? Or row.id? Or row.record_id?
                const itemId = row.record_series_item_id || row.id;

                if (!itemId) {
                    console.error("Missing ID for row:", row);
                    continue; // Skip this row or handle the error
                }

                const cleanRowInput = {
                    records_series_title_and_description: row.records_series_title_and_description,
                    retention_period_active: row.retention_period_active.toString(),
                    retention_period_storage: row.retention_period_storage.toString(),
                    retention_period_total: row.retention_period_total.toString(),
                    disposition_provision: row.disposition_provision,
                    restrictions: row.restrictions,
                    years_or_months: row.years_or_months,
                    date_period_from: row.date_period_from,
                    date_period_to: row.date_period_to,
                    records_medium: row.records_medium,
                    frequency_of_use: row.frequency_of_use,
                    volume: row.volume,
                    time_value: row.time_value,
                    utility_value: row.utility_value,
                    duplication: row.duplication,
                    is_full_date: row.is_full_date || 0
                };

                const rowPayload: any = prefixKeysWithCrc9f(cleanRowInput);

                // 2. Ensure the ID is a valid string/GUID
                rowPayload["crc9f_record_series_item_id@odata.bind"] =
                    `/${process.env.RECORD_SERIES_ITEM_TABLE}(${itemId})`;

                rowPayload["crc9f_nap_form_one_group_id@odata.bind"] = "$1";

                groupOps.push({
                    method: "POST",
                    table: process.env.NAP_FORM_ONE_ROWS_TABLE!,
                    body: rowPayload
                });
            }
            groupedOps.push(groupOps);
        }

        // =========================
        // STEP 4: EXECUTE BATCH
        // =========================
        console.log("DEBUG PAYLOAD:", JSON.stringify(groupedOps[0], null, 2));
        await executeBatchMulti(groupedOps);

        return NextResponse.json({
            success: true,
            groupsCreated: groups.length
        });

    } catch (error) {
        console.error("Bulk refresh error:", error);
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}