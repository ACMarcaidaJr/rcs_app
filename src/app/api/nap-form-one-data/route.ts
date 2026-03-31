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

        let existingRows: any[] = [];

        if (groupGuids.length > 0) {
            const rowData = await fetchFromDataverse({
                table: process.env.NAP_FORM_ONE_ROWS_TABLE!,
                query: `$filter=${groupGuids
                    .map((id: string) => `crc9f_nap_form_one_group_id/crc9f_rcs_nap_form_one_groupid eq '${id}'`)
                    .join(" or ")}&$select=crc9f_rcs_nap_form_one_rowid`
            });
            existingRows = rowData.value || [];
        }
        // if (existingRows.length > 0) {
        //     await executeBatchSafe(
        //         existingRows.map(row => ({
        //             method: "DELETE",
        //             table: process.env.NAP_FORM_ONE_ROWS_TABLE!,
        //             id: row.crc9f_rcs_nap_form_one_rowid
        //         })),
        //         100
        //     );
        // }
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
        // STEP 2: DELETE EXISTING GROUPS & ROWS
        // =========================
        // const deleteOps: BatchOperation[] = [];

        // for (const row of existingRows) {
        //     deleteOps.push({
        //         method: "DELETE",
        //         table: process.env.NAP_FORM_ONE_ROWS_TABLE!,
        //         id: row.crc9f_rcs_nap_form_one_rowid
        //     });
        // }

        // for (const groupId of groupGuids) {
        //     deleteOps.push({
        //         method: "DELETE",
        //         table: process.env.NAP_FORM_ONE_GROUPS_TABLE!,
        //         id: groupId
        //     });
        // }

        // if (deleteOps.length > 0) {
        //     await executeBatchSafe(deleteOps, 50);
        // }

        // =========================
        // STEP 3: CREATE GROUPS + ROWS (1 changeset per group)
        // =========================
        const groupedOps: BatchOperation[][] = [];
        for (const group of groups) {
            const groupOps: BatchOperation[] = [];

            const groupPayload = prefixKeysWithCrc9f({
                is_editing: group.is_editing ? 1 : 0,
                group_title: group.group_title || "",
                is_single_unit: group.is_single_unit ? 1 : 0,
                id: group.id,
                "nap_form_one_header_id@odata.bind":
                    `/${process.env.NAP_FORM_ONE_HEADERS_TABLE}(${form_id})`
            });

            // ✅ Parent (always Content-ID: 1 inside its changeset)
            groupOps.push({
                method: "POST",
                table: process.env.NAP_FORM_ONE_GROUPS_TABLE!,
                body: groupPayload,
                contentId: 1
            });

            const combinedItems = [
                ...((group.group_values || []).map((item: any) => ({
                    ...item,
                    is_group_value: 1
                }))),
                ...((group.items || []).map((item: any) => ({
                    ...item,
                    is_group_value: 0
                })))
            ];

            for (const row of combinedItems) {
                const {
                    id,
                    nap_form_one_group_id,
                    crc9f_nap_form_one_group_id,
                    ["nap_form_one_group_id@odata.bind"]: _bind1,
                    ["crc9f_nap_form_one_group_id@odata.bind"]: _bind2,
                    ...cleanRow
                } = row;

                const rowPayload = prefixKeysWithCrc9f({
                    ...cleanRow,
                    // ✅ ALWAYS reference parent via $1
                    "nap_form_one_group_id@odata.bind": "$1"
                });

                groupOps.push({
                    method: "POST",
                    table: process.env.NAP_FORM_ONE_ROWS_TABLE!,
                    body: rowPayload
                });
            }

            // ✅ Each group becomes its own changeset
            groupedOps.push(groupOps);
        }

        // =========================
        // STEP 4: EXECUTE BATCH
        // =========================
        // Each group's changeset is automatically separated in executeBatchSafe
        await executeBatchMulti(groupedOps);

        return NextResponse.json({
            success: true,
            groupsCreated: groups.length,
            rowsCreated: groupedOps.length - groups.length
        });

    } catch (error) {
        console.error("Bulk refresh error:", error);
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}