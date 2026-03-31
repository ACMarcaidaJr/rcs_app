
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDataverseAccessToken } from '@/lib/getDataverseToken';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';

const DATAVERSE_URL = process.env.NEXT_PUBLIC_DATAVERSE_URL;

export async function POST(req: NextRequest) {
    try {
        const accessToken = await getDataverseAccessToken();
        const { groups, form_id } = await req.json();

        // Step 1: Fetch existing group and row IDs
        const groupData = await fetchFromDataverse({
            table: `${process.env.NAP_FORM_ONE_GROUPS_TABLE}`,
            query: `$filter=crc9f_nap_form_one_header_id/crc9f_rcs_nap_form_one_headerid eq '${form_id}'&$select=crc9f_nap_form_one_group_id, crc9f_rcs_nap_form_one_groupid`
        });

        const groupGuids = groupData.value
            .map((g: any) => g.crc9f_rcs_nap_form_one_groupid)
            .filter(Boolean);

        type ItemData = {
            crc9f_rcs_nap_form_one_rowid?: string;
            crc9f_nap_form_one_row_id?: string;
        };

        let itemData: { value: ItemData[] } = { value: [] };
        console.log("itemData", itemData)
        if (groupGuids.length > 0) {
            itemData = await fetchFromDataverse({
                table: `${process.env.NAP_FORM_ONE_ROWS_TABLE}`,
                query: `$filter=${groupGuids.map((id: string) => `crc9f_nap_form_one_group_id/crc9f_rcs_nap_form_one_groupid eq '${id}'`).join(' or ')}&$select=crc9f_nap_form_one_row_id, crc9f_rcs_nap_form_one_rowid`
            });
        }

        // Step 2: Build deletion changeset
        const deleteChangesetId = `changeset_${uuidv4()}`;
        const deleteChangesetParts: string[] = [];

        // Delete rows
        if (itemData.value.length > 0) {
            for (const item of itemData.value) {
                deleteChangesetParts.push(
                    `--${deleteChangesetId}`,
                    `Content-Type: application/http`,
                    `Content-Transfer-Encoding: binary`,
                    `Content-ID: ${uuidv4()}`,
                    ``,
                    `DELETE /api/data/v9.2/${process.env.NAP_FORM_ONE_ROWS_TABLE}(${item.crc9f_rcs_nap_form_one_rowid}) HTTP/1.1`,
                    `If-Match: *`,
                    ``
                );
            }
        }
        // 2a49c5e9-ab24-fl11-88b3-7ced8de56630
        // Delete groups
        for (const group of groupGuids) {
            deleteChangesetParts.push(
                `--${deleteChangesetId}`,
                `Content-Type: application/http`,
                `Content-Transfer-Encoding: binary`,
                `Content-ID: ${uuidv4()}`,
                ``,
                `DELETE /api/data/v9.2/${process.env.NAP_FORM_ONE_GROUPS_TABLE}(${group}) HTTP/1.1`,
                `If-Match: *`,
                ``
            );
        }

        deleteChangesetParts.push(`--${deleteChangesetId}--`);

        const deleteBatchBoundary = `batch_${uuidv4()}`;
        const deleteBatchBody = [
            `--${deleteBatchBoundary}`,
            `Content-Type: multipart/mixed; boundary=${deleteChangesetId}`,
            ``,
            deleteChangesetParts.join('\r\n'),
            `--${deleteBatchBoundary}--`
        ].join('\r\n');

        // Step 3: Send deletion batch first
        const deleteRes = await fetch(`${DATAVERSE_URL}/$batch`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
                'Content-Type': `multipart/mixed; boundary=${deleteBatchBoundary}`,
                'OData-Version': '4.0',
                'OData-MaxVersion': '4.0',
                Prefer: 'return=representation'
            },
            body: deleteBatchBody
        });

        const deleteResText = await deleteRes.text();
        if (!deleteRes.ok) {
            throw new Error(`Delete batch failed: ${deleteResText}`);
        }

        const batchBoundary = `batch_${uuidv4()}`;
        const batchParts: string[] = [];
        const random_group_id = Math.random().toString(36).slice(2, 12) + Date.now();
        for (const group of groups) {
            const changesetId = `changeset_${uuidv4()}`;
            const changesetParts: string[] = [];
            // Add group creation
            const groupContentId = 1;
            const groupBody = JSON.stringify(
                prefixKeysWithCrc9f({
                    group_title: group.group_title,
                    id: group.id,
                    nap_form_one_group_id: random_group_id + group.id,
                    is_single_unit: group.is_single_unit ? 1 : 0,
                    "nap_form_one_header_id@odata.bind":
                        `/${process.env.NAP_FORM_ONE_HEADERS_TABLE}(${form_id})`
                })
            );
            changesetParts.push(
                `--${changesetId}`,
                `Content-Type: application/http`,
                `Content-Transfer-Encoding: binary`,
                `Content-ID: ${groupContentId}`,
                ``,
                `POST ${DATAVERSE_URL}/${process.env.NAP_FORM_ONE_GROUPS_TABLE} HTTP/1.1`,
                `Content-Type: application/json; type=entry`,
                ``,
                groupBody
            );

            // Add all rows (group_values + items)
            const allItems = [
                ...group.group_values.map((item: object) => ({ ...item, is_group_value: 1 })),
                ...group.items.map((item: object) => ({ ...item, is_group_value: 0 })),
            ];

            let contentIdCounter = 2;
            for (const item of allItems) {
                const itemBody = JSON.stringify(
                    prefixKeysWithCrc9f({
                        ...item,
                        is_group_value: item.is_group_value,
                        "nap_form_one_group_id@odata.bind": `$${groupContentId}`
                    })
                );
                changesetParts.push(
                    `--${changesetId}`,
                    `Content-Type: application/http`,
                    `Content-Transfer-Encoding: binary`,
                    `Content-ID: ${contentIdCounter++}`,
                    ``,
                    `POST ${DATAVERSE_URL}/${process.env.NAP_FORM_ONE_ROWS_TABLE} HTTP/1.1`,
                    `Content-Type: application/json; type=entry`,
                    ``,
                    itemBody
                );
            }

            // Close changeset
            changesetParts.push(`--${changesetId}--`);

            // Add full changeset block to batch
            batchParts.push(
                `--${batchBoundary}`,
                `Content-Type: multipart/mixed; boundary=${changesetId}`,
                ``,
                changesetParts.join('\r\n')
            );
        }

        // Close batch
        batchParts.push(`--${batchBoundary}--`);

        const fullBatchBody = batchParts.join('\r\n');

        const batchResponse = await fetch(`${DATAVERSE_URL}/$batch`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
                'Content-Type': `multipart/mixed; boundary=${batchBoundary}`,
                'OData-Version': '4.0',
                'OData-MaxVersion': '4.0',
                'Prefer': 'return=representation',
            },
            body: fullBatchBody,
        });

        const uploadResText = await batchResponse.text();
        if (!batchResponse.ok) {
            throw new Error(`Batch failed: ${uploadResText}`);
        }

        return NextResponse.json({ success: true, response: uploadResText });
    } catch (error) {
        console.error('Bulk upload error:', error);
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}
